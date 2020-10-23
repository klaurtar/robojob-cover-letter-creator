
const express = require('express');
const dotenv = require('dotenv');


const app = express();
dotenv.config();

const coverLetterBody = 'bla bala ...';

app.get('/cover-letter', (req, res) => {
    const title = 'test title';
    const coverLetter = title + coverLetterBody;

    res.setHeader("Content-Type", "application/octet-stream");

    res.status(200).send(coverLetter);
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})

// RESTful APIs standards.