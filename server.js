require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get('/file/:filename', (req, res) => {
    const filename = path.join('C:\\Sharov\\GraphApp\\data\\' + req.params.filename); //Да хардкодил потом возможны изменения
    fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return res.status(404).send('Такой файл не найден!');
        }
        res.json(data);
    });
});

app.listen(port, ()=> { 
   console.log(`Server start in ${new Date} to http://localhost:${port}`);
});