<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Auth\Notifications\VerifyEmail as BaseVerify;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends BaseVerify
{
    use Queueable;

    /**
     * Build the verification URL using HMAC-SHA256.
     */
    protected function verificationUrl($notifiable)
    {
        $expiration = Carbon::now()
            ->addMinutes(config('auth.verification.expire', 60));

        $hash = hash_hmac(
            'sha256',
            $notifiable->getEmailForVerification(),
            config('app.key')
        );

        return URL::temporarySignedRoute(
            'verification.verify',
            $expiration,
            [
                'id'   => $notifiable->getKey(),
                'hash' => $hash,
            ]
        );
    }

    /**
     * Send your custom Blade template.
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Please Confirm Your Email Address')
            ->view('emails.verify-email', [
                'user'            => $notifiable,
                'verificationUrl' => $verificationUrl,
            ]);
    }
}
