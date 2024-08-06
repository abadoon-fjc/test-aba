const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Для решения проблем с CORS
const app = express();

app.use(express.json());
app.use(cors());  // Разрешаем все запросы

const filePath = path.join(__dirname, 'data.json');

app.post('/api/save-wallet', (req, res) => {
    const newData = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return res.status(500).send('Ошибка сервера');
        }

        let jsonData = [];
        try {
            jsonData = JSON.parse(data);
        } catch (err) {
            console.error('Ошибка парсинга JSON:', err);
        }

        jsonData.push(newData);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Ошибка записи файла:', err);
                return res.status(500).send('Ошибка сервера');
            }

            res.json({ message: 'Информация успешно сохранена!' });
        });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
