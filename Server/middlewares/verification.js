const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const { setDoc, doc, getDoc, collection, query, where, getDocs, deleteDoc } = require('firebase/firestore');
const { db } = require('../config/config');
const Agenda = require('agenda');

require('dotenv').config();


const agenda = new Agenda({db: {address: process.env.MONGODB_URI}});

agenda.define('timeToLive', (job) => {
    try {
        const { email } = job.attrs.data;
        const otpRef = doc(db, 'otp', `${email}`);
    getDoc(otpRef)
        .then(async(docSnapshot) => {
            if(docSnapshot.exists()) {
                deleteDoc(otpRef)
                .then(() => {
                    console.log('Otp expired')
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
})

const getEmail = async (adhaarNo) => {
    try {
        const userRef = doc(db, 'users', `${adhaarNo}`);
        const email = (await getDoc(userRef)).data().email;

        return email;
    } catch (error) {
        console.log(error);
    }
}

const generateOTP = async (req, res, next) => {
    const adhaarNo = jwt.verify(req.cookies.jwt, process.env.SECRET).id;
    const email = await getEmail(adhaarNo);

    try {
        const otpRef = doc(db, 'otp', `${email}`);
        getDoc(otpRef)
            .then(( async(docSnapshot) => {
                await agenda.start();
                await agenda.schedule('in 2 minutes', 'timeToLive', {
                    email: email
                });
                if(!docSnapshot.exists()) {
                    const otp = otpGenerator.generate(6, { 
                        digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false
                    });
                    console.log(otp + " " + email);
                    await setDoc(doc(db, 'otp', `${email}`), {otp});
            
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.GMAIL,
                            pass: process.env.GMAIL_PASSWORD
                        }
                    });
            
                    const response = await transporter.sendMail({
                        from: process.env.GMAIL,
                        to: email,
                        subject: 'OTP VERIFICATION',
                        text: `Your OTP for verification is: ${otp}`
                    });
            
                    res.json(response)
                } else {
                    res.status(200).json({
                        message: 'OTP already sent'
                    })
                }
            })
        )
        
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Some error occured while sending OTP',
            error: err
        })
    }
}

const verfiyOTP = async (req, res, next) => {
    try {
        const otp = req.body.otp;
        const adhaarNo = jwt.verify(req.cookies.jwt, process.env.SECRET).id;
        const email = await getEmail(adhaarNo);

        const otpRef = doc(db, 'otp', `${email}`);
        const originalOtp = (await getDoc(otpRef)).data().otp;

        if(originalOtp == otp) {
            res.status(200).json({
                message: 'OTP verified successfully'
            })
        } else {
            res.status(400).json({
                message: 'Invalid OTP'
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Some error occured while verifiying OTP',
            error: err
        })
    }
}

module.exports = {
    generateOTP,
    verfiyOTP
}