const jwt = require('jsonwebtoken');
const { db } = require('../config/config');
const { doc, getDoc, setDoc } = require('firebase/firestore');

require('dotenv').config();
const jwtSecret = process.env.SECRET;

const createUser = async(req, res, next) => {
    try {
        const data = req.body;
        const adhaarNo = req.body.adhaarNo;

        await setDoc(doc(db, 'users', `${data.adhaarNo}`), data)
        .then((user) => {

            const maxAge = 3*60*60;
            const token = jwt.sign(
                {id: adhaarNo, username: data.username,},
                jwtSecret,
                {
                    expiresIn: maxAge
                }
            );
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge*1000
            });
            res.status(200).json({
                message: "User successfully created",
                user,
            });
        })
    } catch (err) {
         console.log(err)
        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

const getUser = async(req, res, next) => {
    try {
        const adhaarNo = req.params.id;
        const userRef = doc(db, 'users', `${adhaarNo}`);
        getDoc(userRef)
            .then( async(docSnapshot) => {
                if (docSnapshot.exists()) {
                    const maxAge = 3*60*60;
                    const token = jwt.sign(
                        {id: adhaarNo},
                        jwtSecret,
                        {
                            expiresIn: maxAge,
                        }
                    );
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        maxAge: maxAge*1000,
                    });
                    res.status(201).json({
                        message: "Login Successful",
                    });
                } else {
                    res.status(403).json({
                        message: "Login Failed"
                    });
                }
            })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Some error occurred",
            error: err
        });
    }
}

module.exports = {
    createUser,
    getUser
}