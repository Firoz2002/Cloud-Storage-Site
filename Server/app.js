const cors = require('cors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

app.set('views', path.join(__dirname, '../Client/views'))
app.set('view engine', 'ejs');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../Client/public')));

app.use(require('./route/route'));

app.get('/', (req, res) => { res.render('home')});
app.get('/verification', (req, res) => { res.render('verify')});
app.get('/register', (req, res) => {res.render('register')});
app.get('/login', (req, res) => {res.render('login')});
app.get('/upload', (req, res) => { res.render('upload')});
app.get('/family', (req, res) => { res.render('family')});
app.get('/documents', (req, res) => { res.render('documents')});

app.listen(PORT, async () => {
    try {
        console.log(`Server started on PORT: ${PORT}`);
    } catch (error) {
        throw {error}
    }
})