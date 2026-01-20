<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class OtpMail extends Mailable
{
    public function __construct(
        public string $otp,
        public int $minutes = 10
    ) {}

    public function build()
    {
        return $this->subject('Your OTP')
            ->view('emails.otp');
    }
}
