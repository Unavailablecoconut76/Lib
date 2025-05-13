export function generateVerificationOtpEmailtemplate(otpCode) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">Email Verification</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Thank you for registering! Please use the verification code below to complete your registration:
                </p>
                <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <span style="font-size: 24px; font-weight: bold; color: #3498db; letter-spacing: 5px;">
                        ${otpCode}
                    </span>
                </div>
                <p style="color: #666; font-size: 14px;">
                    This code will expire in 20 minutes. If you didn't request this verification, please ignore this email.
                </p>
            </div>
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px;">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        </div>`
}

export function generateForgotPasswordEmailtemplate(resetPasswordUrl) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">Password Reset Request</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    We received a request to reset your password. Click the button below to create a new password:
                </p>
                <div style="margin: 30px 0;">
                    <a href="${resetPasswordUrl}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    If the button doesn't work, copy and paste this link into your browser:
                    <br>
                    <span style="color: #3498db; word-break: break-all;">${resetPasswordUrl}</span>
                </p>
            </div>
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px;">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        </div>`
}