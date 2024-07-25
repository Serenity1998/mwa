const express = require('express');
const fs = require('fs');
const path = require('path');
const games = require('./files/games.json')
const students = require('./files/school.json')

const app = express();
const port = 8484;

const readStaticFiles = async (file_path) => {
    try {
        const data = await fs.promises.readFile(path.join(__dirname, file_path), 'utf-8');
        return data;
    } catch (e) {
        console.log("Error while trying to read file: ", e);
    }
};

app.get('/page1.html', async (req, res) => {
    const data = await readStaticFiles('./templates/page1.html');
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
});

app.get('/page2.html', async (req, res) => {
    const data = await readStaticFiles('./templates/page2.html');
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
});

app.get('/', async (req, res) => {
    if (req.query.a !== undefined && req.query.b !== undefined) {
        const result = parseInt(req.query.a) * parseFloat(req.query.b)
        console.log(parseInt(req.query.a) * parseFloat(req.query.b))
        res.setHeader('Content-Type', 'text/json');
        res.send(JSON.stringify(result));
    } else {
        res.setHeader('Content-Type', 'text/json');
        res.send(games);
    }
});

app.get('/:a/:b', async (req, res) => {
    const result = parseInt(req.params.a, 10) * parseFloat(req.params.b, 10)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: result }));
});

app.get('/students/:num', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log("hell")
    const index = parseInt(req.params.num, 10);
    if (index >= 0 && index < students.length) {
        res.setHeader('Content-Type', 'application/json');
        res.json(students[index]);
    } else {
        res.status(404).send('Student not found');
    }
});

app.get('/students', (req, res) => {
    res.setHeader('Content-Type', 'text/json')
    res.send(JSON.stringify(students))
})


app.get('/index.html', async (req, res) => {
    const data = await readStaticFiles('./templates/index.html');
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
});

app.use((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({ error: "Can't find your request" });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
