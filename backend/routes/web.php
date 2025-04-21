<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return view('welcome');
});

// 1) Show the “Add Balance” form
Route::get('/balance/add/{user}', [PaymentController::class,'showAddBalanceForm'])
     ->name('balance.add');

// 2) Process the form submission
Route::post('/balance/process', [PaymentController::class,'process'])
     ->name('balance.process');

// 3) Explicit, named SSLCOMMERZ callbacks
Route::match(['get','post'],'/payment/ssl-success',[PaymentController::class,'sslSuccess'])
     ->name('payment.ssl-success');
Route::match(['get','post'],'/payment/ssl-fail',   [PaymentController::class,'sslFail'])
     ->name('payment.ssl-fail');
Route::match(['get','post'],'/payment/ssl-cancel', [PaymentController::class,'sslCancel'])
     ->name('payment.ssl-cancel');
Route::post(               '/payment/ssl-ipn',    [PaymentController::class,'sslIpn'])
     ->name('payment.ssl-ipn');

// 4) Catch sandbox’s default redirects (in case your post_data is ignored)
Route::match(['get','post'],'/success', [PaymentController::class,'sslSuccess']);
Route::match(['get','post'],'/fail',    [PaymentController::class,'sslFail']);
Route::match(['get','post'],'/cancel',  [PaymentController::class,'sslCancel']);
