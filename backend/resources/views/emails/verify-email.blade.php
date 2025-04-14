<!DOCTYPE html>
<html lang="en" xml:lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email | BanglaHire</title>
    <style type="text/css">
        /* Global styles */
        body {
            background-color: #f6f6f6;
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #4a90e2;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 30px 20px;
            color: #555555;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            background-color: #4a90e2;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            background-color: #f1f1f1;
            color: #888888;
            font-size: 12px;
            text-align: center;
            padding: 15px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            BanglaHire
        </div>
        <!-- Email Content -->
        <div class="content">
            <p>Hello, {{ $user->name }}!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="{{ $verificationUrl }}" class="button">Verify Email</a>
            </p>
            <p>
                Thank you for joining us! We are excited to have you at <strong>BanglaHire</strong> and look forward to providing you with amazing opportunities.
            </p>
        </div>
        <!-- Footer -->
        <div class="footer">
            © {{ date('Y') }} BanglaHire. All rights reserved.
        </div>
    </div>
</body>
</html>
