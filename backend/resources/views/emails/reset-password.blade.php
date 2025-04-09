<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password | BanglaHire</title>
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
        <!-- Content -->
        <div class="content">
            <p>Hello, {{ $user->name }}!</p>
            <p>You are receiving this email because we received a password reset request for your account.</p>
            <p style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Reset Password</a>
            </p>
            <p>If you did not request a password reset, no further action is required.</p>
            <p>For security reasons, this link will expire in 60 minutes.</p>
        </div>
        <!-- Footer -->
        <div class="footer">
            © {{ date('Y') }} BanglaHire. All rights reserved.
        </div>
    </div>
</body>
</html>
