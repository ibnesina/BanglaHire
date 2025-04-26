<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/balance/add/{user}',     [PaymentController::class,'showAddBalanceForm'])
     ->name('balance.add');
Route::post('/balance/process',       [PaymentController::class,'process'])
     ->name('balance.process');

// SSLCommerz callbacks
Route::match(['get','post'], '/payment/ssl-success', [PaymentController::class,'sslSuccess'])->name('sslc.success');
Route::post('/payment/ssl-ipn',    [PaymentController::class,'sslIpn'])->name('sslc.ipn');
Route::match(['get','post'], '/payment/ssl-fail',   [PaymentController::class,'sslFail'])->name('sslc.failure');
Route::match(['get','post'], '/payment/ssl-cancel', [PaymentController::class,'sslCancel'])->name('sslc.cancel');


// Stripe callbacks (unchanged)
Route::get('/payment/stripe-success', [PaymentController::class,'stripeSuccess'])
     ->name('payment.stripe-success');
Route::get('/payment/stripe-cancel',  [PaymentController::class,'stripeCancel'])
     ->name('payment.stripe-cancel');
