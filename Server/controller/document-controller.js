const multer = require("multer");
const jwt = require('jsonwebtoken');
const { ref, getStorage, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
const { doc, setDoc, collection, getDocs, where, query } = require("firebase/firestore");
const { db } = require("../config/config");

require('dotenv').config();

const storage = getStorage();
const upload = multer({storage: multer.memoryStorage()});

const addDocument = async (data) => {

    try {
        await setDoc(doc(db, 'documents', data.adhaarNo), data)
        .then(() => {
            return {
                message: 'File uploaded successfully'
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const uploadDocument = async (req, res, next) => {

    try {
        const adhaarNo = jwt.verify(req.cookies.jwt, process.env.SECRET).id;

        const storageRef = ref(storage, `documents/${adhaarNo}/${req.file.originalname}`);
        const metadata = {
            contentType: req.file.mimetype,
        }
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Successfully");
        const data = {
            adhaarNo: adhaarNo,
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        }
        await addDocument(data)
        .then(() => {
            res.status(200).json({
                message: "Success"
            })
        })
    } catch (error) {
        console.log(error);
    }
}

const getDocument = async(req, res, next) => {
    try {
        const adhaarNo = '28'//jwt.verify(req.cookies.jwt, process.env.SECRET).id;
        const docRef = collection(db, 'documents');
        const data = query(docRef, where('adhaarNo', '==', "24"));
        const documents = await getDocs(data);
       
        const arr = [];

        documents.forEach((doc) => {
            arr.push(doc.data());    
        });
        res.send(arr);

    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {
    addDocument,
    getDocument,
    uploadDocument
}