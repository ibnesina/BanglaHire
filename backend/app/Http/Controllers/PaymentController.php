<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Library\SslCommerz\SslCommerzNotification;
use Raziul\Sslcommerz\Facades\Sslcommerz;

use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    /** Show add‑balance form **/
    public function showAddBalanceForm($user)
    {
        $user = User::findOrFail($user);
        return view('add_balance', ['user_id' => $user->id]);
    }

    /** Handle form and initiate SSLCOMMERZ **/
    public function process(Request $request)
    {
        $data = $request->validate([
            'amount'         => 'required|numeric|min:1',
            'payment_method' => 'required|in:sslcommerz,stripe',
            'user_id'        => 'required|uuid|exists:users,id',
        ]);

        // Authenticate and prepare
        $user = User::findOrFail($data['user_id']);
        Auth::login($user);
        $trx = uniqid();
        $amt = $data['amount'];
        $cur = 'BDT';

        // Create pending record
        Transaction::create([
            'user_id'        => $user->id,
            'payment_method' => $data['payment_method'],
            'transaction_id' => $trx,
            'amount'         => $amt,
            'currency'       => $cur,
            'status'         => 'Pending',
        ]);

        if ($data['payment_method'] === 'sslcommerz') {
            // Use facade to set order, customer, then initiate hosted checkout
            $response = Sslcommerz::setOrder($amt, $trx, 'Account Top‑Up')    // set order amount, ID, description
                ->setCustomer($user->name, $user->email, $user->payment_phone ?? '017xxxxxxxx')
                ->setShippingInfo(0,'')                                      // no shipping
                ->makePayment();                                             // returns a response object

                if ($response->success()) {
                    return redirect($response->gatewayPageURL());
                }
                
                $reason = $response->failedReason()
                        ?? json_encode($response->toArray(), JSON_UNESCAPED_UNICODE);
                
                return back()->with('error', 'SSLCommerz init failed: '.$reason);
        }

        // === Stripe (keep your original format) ===
        Stripe::setApiKey(config('services.stripe.secret'));                // Cashier could be used, but this matches your pattern :contentReference[oaicite:3]{index=3}
        $session = Session::create([
            'payment_method_types'=>['card'],
            'mode'                =>'payment',
            'client_reference_id' =>$trx,
            'customer_email'      =>$user->email,
            'line_items'          =>[[
                'price_data'=>[
                    'currency'    =>$cur,
                    'product_data'=>['name'=>'Account Top‑Up'],
                    'unit_amount' =>$amt * 100,
                ],
                'quantity'=>1,
            ]],
            'success_url'=> url('/payment/stripe-success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => url('/payment/stripe-cancel'),
        ]);

        return redirect($session->url);
    }

    /** SSLCommerz IPN (server‑to‑server) **/
    public function sslIpn(Request $request)
    {
        $data = $request->all();
        $trx  = $data['tran_id'] ?? null;

        $order = Transaction::where('transaction_id',$trx)
                            ->where('status','Pending')
                            ->first();
        if (! $order) {
            echo "IPN: Invalid or duplicate"; return;
        }

        if (Sslcommerz::validatePayment($data,$trx,$order->amount)) {
            $order->update(['status'=>'Completed','metadata'=>$data]);
            $order->user->increment('balance',$order->amount);
            echo "IPN: Completed"; return;
        }
        echo "IPN: Validation failed";
    }

    /** SSLCommerz Success callback **/
    public function sslSuccess(Request $request)
    {
        dd($request);
        
        $data = $request->all();
        $trx  = $data['tran_id'] ?? null;

        $order = Transaction::where('transaction_id',$trx)
                            ->where('status','Pending')
                            ->firstOrFail();

        if (! Sslcommerz::validatePayment($data,$trx,$order->amount)) {
            return view('payment.failure');
        }

        $order->update(['status'=>'Completed','metadata'=>$data]);
        $order->user->increment('balance',$order->amount);

        return view('payment.success',['amount'=>$order->amount,'currency'=>$order->currency]);
    }

    /** SSLCommerz Fail & Cancel callbacks **/
    public function sslFail(Request $request)
    {
        $trx = $request->input('tran_id');
        Transaction::where('transaction_id',$trx)
                   ->where('status','Pending')
                   ->update(['status'=>'Failed']);
        return view('payment.failure');
    }

    public function sslCancel(Request $request)
    {
        $trx = $request->input('tran_id');
        Transaction::where('transaction_id',$trx)
                   ->where('status','Pending')
                   ->update(['status'=>'Canceled']);
        return view('payment.failure');
    }

    /** Stripe success callback **/
    public function stripeSuccess(Request $request)
    {
        $sessionId = $request->query('session_id');
        if (! $sessionId) {
            return view('payment.failure');
        }

        Stripe::setApiKey(config('services.stripe.secret'));
        $session = Session::retrieve($sessionId);
        // :contentReference[oaicite:4]{index=4}

        if ($session->payment_status !== 'paid') {
            return view('payment.failure');
        }

        $order = Transaction::where('transaction_id', $session->client_reference_id)
                            ->where('status', 'Pending')
                            ->firstOrFail();

        $order->update([
            'status'   => 'Completed',
            'metadata' => ['stripe_session_id' => $sessionId],
        ]);
        $order->user->increment('balance', $order->amount);

        return view('payment.success', [
            'amount'   => $order->amount,
            'currency' => $order->currency,
        ]);
    }

    /** Stripe cancel callback **/
    public function stripeCancel()
    {
        // No DB update needed—remains “Pending” or let user retry
        return view('payment.failure');
    }
}
