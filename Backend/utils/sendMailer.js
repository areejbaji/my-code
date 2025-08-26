// // 
//  const nodeMailer = require('nodemailer');

// const sendMailer = (otp, email) => {
//   try {
//     const transporter = nodeMailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });

//     // Check SMTP connection
//     transporter.verify((error, success) => {
//       if (error) {
//         console.log('❌ SMTP connection failed:', error);
//       } else {
//         console.log('✅ SMTP server is ready to send emails');
//       }
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'Password Reset OTP',
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd;">
//           <h2>Password Reset</h2>
//           <p>Your OTP is: <strong>${otp}</strong></p>
//         </div>
//       `
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('❌ SendMail error:', error);
//         throw new Error('Failed to send email');
//       } else {
//         console.log('✅ Email sent successfully:', info.response);
//       }
//     });

//   } catch (error) {
//     console.log('📛 Error in sendMailer:', error.message);
//   }
// };

// module.exports = sendMailer;
const nodemailer = require('nodemailer');

const sendMailer = async (otp, email) => {
  try {
    // Create transporter using TLS (port 587)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,           // TLS port (reliable)
      secure: false,       // Must be false for TLS
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP server is ready to send emails');

    // Mail options
    const mailOptions = {
      from: `"StyleHub" <${process.env.EMAIL}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd;">
          <h2>Password Reset</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);

  } catch (error) {
    console.error('📛 Failed to send email:', error.message);
    // We throw the error so the route can handle it with try/catch
    throw error;
  }
};

module.exports = sendMailer;

