const multer = require('multer');
const express = require('express');

const { createUser, getUser } = require('../controller/user-controller');
const { uploadDocument, getDocument } = require('../controller/document-controller');
const { generateOTP, verfiyOTP } = require('../middlewares/verification');

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.route('/register').post(createUser);
router.route(`/signin/:id`).get(getUser);

router.route('/generate-otp').post(generateOTP);
router.route('/verify-otp').post(verfiyOTP);

router.route('/getMembers').get();
router.route('/upload').post(upload.single('document'), uploadDocument);
router.route('/getDocuments').get(getDocument);

module.exports = router;