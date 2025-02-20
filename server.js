require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let baseFolder = '';

app.post('/set-folder', (req, res) => {
    const { folderPath } = req.body;
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return res.status(400).send('Папка не существует или это не директория');
    }
    baseFolder = folderPath;
    res.send('Базовая папка установлена');
});

app.get('/files', (req, res) => {
  if (!baseFolder) {
    return res.status(400).send('Базовая папка не установлена');
  }
  fs.readdir(baseFolder, (err, files) => {
    if (err) {
      console.error('Ошибка чтения папки:', err);
      return res.status(500).send('Ошибка чтения папки');
    }
    const fileList = files.filter(file => fs.statSync(path.join(baseFolder, file)).isFile());
    res.json(fileList);
  });
});

app.get('/file/:filename', (req, res) => {
  const filename = path.join(baseFolder, req.params.filename);
  fs.readFile(filename, 'utf-8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      return res.status(404).send('Такой файл не найден!');
    }
    res.json({ content: data });
  });
});

app.listen(port, () => {
  console.log(`Server start in ${new Date()} to http://localhost:${port}`);
});