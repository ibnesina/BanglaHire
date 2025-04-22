<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Library\SslCommerz\SslCommerzNotification;

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
        $request->validate([
            'amount'         => 'required|numeric|min:1',
            'payment_method' => 'required|in:sslcommerz,stripe',
            'user_id'        => 'required|uuid|exists:users,id',
        ]);

        http://localhost:8000/message/?sender=2fe6c689-4bee-4b4b-b3e1-e3af1f17db86,?receiver=uuid

        // Authenticate by UUID
        $user = User::findOrFail($request->user_id);
        Auth::login($user);

        $amount   = $request->amount;
        $method   = $request->payment_method;
        $tranId   = uniqid();
        $currency = 'BDT';

        // Record pending transaction
        Transaction::create([
            'user_id'        => $user->id,
            'payment_method' => $method,
            'transaction_id' => $tranId,
            'amount'         => $amount,
            'currency'       => $currency,
            'status'         => 'Pending',
        ]);

        if ($method === 'sslcommerz') {
            $post_data = [
                'total_amount'     => $amount,
                'currency'         => $currency,
                'tran_id'          => $tranId,
                'cus_name'         => $user->name,
                'cus_email'        => $user->email,
                'cus_add1'         => $user->profile_picture ?? '',
                'cus_phone'        => $user->payment_phone ?? '017xxxxxxxx',
                'shipping_method'  => 'NO',
                'product_name'     => 'Account Top‑Up',
                'product_category' => 'Wallet',
                'product_profile'  => 'general',
                // **Absolute** callbacks
                'success_url'      => url('/payment/ssl-success'),
                'fail_url'         => url('/payment/ssl-fail'),
                'cancel_url'       => url('/payment/ssl-cancel'),
                'ipn_url'          => url('/payment/ssl-ipn'),
            ];

            $sslc = new SslCommerzNotification();
            return $sslc->makePayment($post_data, 'hosted');
        }


        // === Stripe Checkout ===
        
        // Initialize Stripe
        Stripe::setApiKey(config('services.stripe.secret'));

        // Create a Checkout Session
        $session = Session::create([
            'payment_method_types' => ['card'],
            'mode'                 => 'payment',
            'client_reference_id'  => $tranId,
            'customer_email'       => $user->email,
            'line_items'           => [[
                'price_data' => [
                    'currency'     => $currency,
                    'product_data' => ['name' => 'Account Top‑Up'],
                    'unit_amount'  => $amount * 100,
                ],
                'quantity' => 1,
            ]],
            'success_url' => url('/payment/stripe-success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => url('/payment/stripe-cancel'),
        ]);

        // Redirect user to Stripe Checkout page
        return redirect($session->url);
    }

    /** Success callback **/
    public function sslSuccess(Request $request)
    {
        $order = Transaction::where('transaction_id', $request->tran_id)
                            ->where('status','Pending')
                            ->firstOrFail();

        $sslc  = new SslCommerzNotification();
        $valid = $sslc->orderValidate(
            $request->all(),
            $request->tran_id,
            $request->amount,
            $request->currency
        );

        if (! $valid) {
            return view('payment.failure');
        }

        // Complete order & update user balance
        $order->update([
            'status'   => 'Completed',
            'metadata' => $request->all(),
        ]);
        $order->user->increment('balance', $order->amount);

        return view('payment.success', [
            'amount'   => $order->amount,
            'currency' => $order->currency,
        ]);
    }

    /** Failure callback **/
    public function sslFail(Request $request)
    {
        Transaction::where('transaction_id',$request->tran_id)
                   ->where('status','Pending')
                   ->update(['status'=>'Failed']);

        return view('payment.failure');
    }

    /** Cancel callback **/
    public function sslCancel(Request $request)
    {
        Transaction::where('transaction_id',$request->tran_id)
                   ->where('status','Pending')
                   ->update(['status'=>'Canceled']);

        return view('payment.failure');
    }

    /** IPN server‑to‑server **/
    public function sslIpn(Request $request)
    {
        if (! $request->filled('tran_id')) {
            echo "IPN: Missing tran_id"; return;
        }

        $order = Transaction::where('transaction_id',$request->tran_id)
                            ->where('status','Pending')
                            ->first();
        if (! $order) {
            echo "IPN: Invalid or duplicate"; return;
        }

        $sslc  = new SslCommerzNotification();
        $valid = $sslc->orderValidate(
            $request->all(),
            $request->tran_id,
            $order->amount,
            $order->currency
        );
        if ($valid) {
            $order->update(['status'=>'Completed','metadata'=>$request->all()]);
            $order->user->increment('balance', $order->amount);
            echo "IPN: Completed"; return;
        }

        echo "IPN: Validation failed";
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
