<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Raziul\Sslcommerz\Facades\Sslcommerz;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

class PaymentController extends Controller
{
    /**
     * POST /api/payments
     * Initiate a top-up via SSLCommerz or Stripe.
     * Returns JSON with the checkout URL.
     */
    public function process(Request $request)
    {
        $data = $request->validate([
            'amount'         => 'required|numeric|min:1',
            'payment_method' => 'required|in:sslcommerz,stripe',
        ]);

        // 1) Auth
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 2) Create pending transaction
        $trx = uniqid('trx_');
        $amt = $data['amount'];
        $cur = 'BDT';

        Transaction::create([
            'user_id'        => $user->id,
            'payment_method' => $data['payment_method'],
            'transaction_id' => $trx,
            'amount'         => $amt,
            'currency'       => $cur,
            'status'         => 'Pending',
        ]);

        // 3) Gateway init
        if ($data['payment_method'] === 'sslcommerz') {
            // SSLCommerz uses the routes defined in config/sslcommerz.php
            $resp = Sslcommerz::setOrder($amt, $trx, 'Account Top-Up')
                ->setCustomer($user->name, $user->email, $user->payment_phone ?? '')
                ->setShippingInfo(0, '')
                ->makePayment();

            if (! $resp->success()) {
                return response()->json([
                    'message' => 'SSLCommerz init failed: '
                                 . ($resp->failedReason() ?? 'Unknown')
                ], 500);
            }

            $checkoutUrl = $resp->gatewayPageURL();

        } else {
            // 4) Stripe init
            Stripe::setApiKey(config('services.stripe.secret'));
            $frontend = config('app.frontend_url');

            $session = StripeSession::create([
                'payment_method_types' => ['card'],
                'mode'                 => 'payment',
                'client_reference_id'  => $trx,
                'customer_email'       => $user->email,
                'line_items'           => [[
                    'price_data' => [
                        'currency'     => $cur,
                        'product_data' => ['name' => 'Account Top-Up'],
                        'unit_amount'  => (int)($amt * 100),
                    ],
                    'quantity'   => 1,
                ]],
                'success_url' => "{$frontend}/add-balance/stripe-success?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url'  => "{$frontend}/add-balance/stripe-cancel",
            ]);

            $checkoutUrl = $session->url;
        }

        // 5) Final return
        return response()->json([
            'transaction_id' => $trx,
            'checkout_url'   => $checkoutUrl,
        ], 201);
    }

    /**
     * POST /api/payments/ssl-ipn
     * SSLCommerz IPN callback.
     */
    public function sslIpn(Request $request)
    {
        $data = $request->all();
        $trx  = $data['tran_id'] ?? null;

        $order = Transaction::where('transaction_id', $trx)
                            ->where('status', 'Pending')
                            ->first();
        if (! $order) {
            return response()->json(['message' => 'Invalid or duplicate IPN'], 400);
        }

        if (Sslcommerz::validatePayment($data, $trx, $order->amount)) {
            $order->update(['status' => 'Completed', 'metadata' => $data]);
            $order->user->increment('balance', $order->amount);
            return response()->json(['message' => 'Completed'], 200);
        }

        return response()->json(['message' => 'Validation failed'], 400);
    }

    /**
     * GET|POST /api/payments/ssl-success
     * SSLCommerz success callback.
     */
    public function sslSuccess(Request $request)
    {
        $data = $request->all();
        $trx  = $data['tran_id'] ?? null;

        $order = Transaction::where('transaction_id', $trx)
                            ->where('status', 'Pending')
                            ->first();
        if (! $order || ! Sslcommerz::validatePayment($data, $trx, $order->amount)) {
            return response()->json(['message' => 'Payment validation failed'], 400);
        }

        $order->update(['status' => 'Completed', 'metadata' => $data]);
        $order->user->increment('balance', $order->amount);

        return response()->json([
            'message'        => 'Payment successful',
            'amount'         => $order->amount,
            'currency'       => $order->currency,
            'transaction_id' => $trx,
        ], 200);
    }

    /**
     * POST /api/payments/ssl-fail
     * SSLCommerz failure/cancel callback.
     */
    public function sslFail(Request $request)
    {
        $trx = $request->input('tran_id');
        Transaction::where('transaction_id', $trx)
                   ->where('status', 'Pending')
                   ->update(['status' => 'Failed']);

        return response()->json(['message' => 'Payment failed or cancelled'], 200);
    }

    /**
     * POST /api/payments/ssl-cancel
     * SSLCommerz explicit cancel callback.
     */
    public function sslCancel(Request $request)
    {
        $trx = $request->input('tran_id');
        Transaction::where('transaction_id', $trx)
                   ->where('status', 'Pending')
                   ->update(['status' => 'Canceled']);

        return response()->json(['message' => 'Payment cancelled'], 200);
    }

    /**
     * GET /api/payments/stripe-success
     * Stripe success callback.
     */
    public function stripeSuccess(Request $request)
    {
        $sessionId = $request->query('session_id');
        if (! $sessionId) {
            return response()->json(['message' => 'No session_id provided'], 400);
        }

        Stripe::setApiKey(config('services.stripe.secret'));
        $session = StripeSession::retrieve($sessionId);
        if ($session->payment_status !== 'paid') {
            return response()->json(['message' => 'Payment not completed'], 400);
        }

        $order = Transaction::where('transaction_id', $session->client_reference_id)
                            ->where('status', 'Pending')
                            ->firstOrFail();

        $order->update([
            'status'   => 'Completed',
            'metadata' => ['stripe_session_id' => $sessionId],
        ]);
        $order->user->increment('balance', $order->amount);

        return response()->json([
            'message'        => 'Payment successful',
            'amount'         => $order->amount,
            'currency'       => $order->currency,
            'transaction_id' => $order->transaction_id,
        ], 200);
    }

    /**
     * GET /api/payments/stripe-cancel
     * Stripe cancel callback.
     */
    public function stripeCancel()
    {
        return response()->json(['message' => 'Payment cancelled'], 200);
    }
}
