<?php

namespace App\Http\Middleware;

// use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;

// class VerifyCsrfToken extends BaseVerifier
// {
//     /**
//      * The URIs that should be excluded from CSRF verification.
//      *
//      * @var array
//      */
//     protected $except = [
//         // 'login/google/callback', // Add the Google callback URL to the CSRF exceptions
//         // 'api/*'
//     ];
// }

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        'payment/ssl-success',
        'payment/ssl-fail',
        'payment/ssl-cancel',
        'payment/ssl-ipn',
    ];
}
