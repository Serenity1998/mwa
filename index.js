const express = require('express');
const fs = require('fs');
const path = require('path');

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
    const data = await readStaticFiles('./templates/index.html');
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
});

app.get('/index.html', async (req, res) => {
    const data = await readStaticFiles('./templates/index.html');
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
});

app.get('/api/status', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: 200, message: "Successful" });
});

app.use((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({ error: "Can't find your request" });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
