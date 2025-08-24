// 
const nodeMailer = require('nodemailer');

const sendMailer = (otp, email) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Check SMTP connection
    transporter.verify((error, success) => {
      if (error) {
        console.log('❌ SMTP connection failed:', error);
      } else {
        console.log('✅ SMTP server is ready to send emails');
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd;">
          <h2>Password Reset</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ SendMail error:', error);
        throw new Error('Failed to send email');
      } else {
        console.log('✅ Email sent successfully:', info.response);
      }
    });

  } catch (error) {
    console.log('📛 Error in sendMailer:', error.message);
  }
};

module.exports = sendMailer;
