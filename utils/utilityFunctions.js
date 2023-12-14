const nodemailer = require('nodemailer');

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "talhazubair.info@gmail.com",
            pass: "lhvmnbnvjuolnnof",
        },
    });

    const mailOptions = {
        from: 'talhazubair.info@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};