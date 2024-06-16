const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

require('dotenv').config();
/*
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MESAUREMENT_ID
}*/

const firebaseConfig = {
    apiKey: "AIzaSyCH8tuZNbaeS8PliXego41qrkZoGwMX63Q",
    authDomain: "storage-site-9c81e.firebaseapp.com",
    projectId: "storage-site-9c81e",
    storageBucket: "storage-site-9c81e.appspot.com",
    messagingSenderId: "875022356094",
    appId: "1:875022356094:web:5c1c95c6094f335895922f",
    measurementId: "G-7MEBXEQ4FH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    db,
};