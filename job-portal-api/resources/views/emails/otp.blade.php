<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Email verification</h2>
    <p>Your OTP is:</p>
    <h1 style="letter-spacing: 4px;">{{ $otp }}</h1>
    <p>Valid for {{ $minutes }} minutes.</p>
    <p>If you didn’t request this, ignore this email.</p>
  </body>
</html>
