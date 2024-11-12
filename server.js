const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/logos', (req, res) => {
    const logosDir = path.join(__dirname, 'public/CompanyLogos');
    fs.readdir(logosDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const logos = files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));
        res.json(logos);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});














