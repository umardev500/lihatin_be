require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const linksRouter = require('./routes/links');
const authRouter = require('./routes/auth');
const redirectRouter = require('./routes/redirect');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors({
    origin: '*'
}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     optionsSuccessStatus: 200
// }));

app.use('/auth', authRouter);
app.use('/links', linksRouter);

app.use('', redirectRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://127.0.0.1:${process.env.PORT}!`)
});