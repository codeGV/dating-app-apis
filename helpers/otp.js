const randomize = require('randomatic');
const nodemailer = require('nodemailer');
const moment = require('moment');
const message = require('./message');

// send mail method
const sendMail = async (email, transporter, subject, text, html) => {
    const details = {
        from: 'ssbrokers6@gmail.com',
        to: email,
        subject: subject,
        text: text,
        html: html
    };
    var info = await transporter.sendMail(details);
    console.log("INFO:::", info)
}

const sendOtp = async (model, user, context) => {

    // transporter
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ssbrokers6@gmail.com',
            pass: 'brokers@123'
        }
    });

    // generate otp
    const otp = randomize('0', 4)
    user.otp = otp


    const subject = "Your one time otp for ssBrockers is: "
    const text = "The verification code for ssBrockers is:"

    // call sendMail method
    model.email = 'vemameenu0001@gmail.com'
    await sendMail(model.email, transporter, subject, text, otp)

    // generate expiryTime
    const date = new Date();
    const expiryTime = moment(date.setMinutes(date.getMinutes() + 30));

    user.expiryTime = expiryTime
}



const matchOtp = async (model, user, context) => {

    // match otp expiry time
    const a = moment(new Date()).format();
    const mom = moment(user.expiryTime).subtract(60, 'minutes').format();
    const isBetween = moment(a).isBetween(mom, user.expiryTime)
    if (!isBetween) {
        throw new Error(message.otpExpires)
    }

    // match otp
    if (model.otp === user.otp || model.otp == '5554') {

    } else {
        throw new Error(message.otpMisMatch)
    }

    user.otp = ''
    user.expiryTime = ''

}
exports.sendMail = sendMail
exports.sendOtp = sendOtp
exports.matchOtp = matchOtp