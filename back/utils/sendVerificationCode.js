import { generateVerificationOtpEmailtemplate } from "./emailTemplate.js";
import { sendEmail } from "./sendEmail.js";
export async function  sendVerificationCode(verificationCode,email,res) {
    try{
        const message=generateVerificationOtpEmailtemplate(verificationCode);
        sendEmail({
            email,
            subject:"Veriication code,MITAOE",
            message,
        });
        res.status(200).json({
            success:true,
            message:"verificaton mail sent!"
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"verification code Failed to send",
        });
    }
    
}