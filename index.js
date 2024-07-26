const express = require('express');
const { error } = require('console');
const db = require('./db_connection.js');
const app = express();
const port = 3000;

app.use(express.json());

// Create a new game
app.post('/games', async (req, res) => {
    const collection = db.get('games');
    const { title, price, minPlayers, minAge } = req.body;
    if (typeof title !== 'string' || typeof price !== 'number' || minPlayers < 1 || minPlayers > 10 || minAge < 7 || minAge > 99) {
        return res.status(400).send('Invalid input:', error);
    }
    const newGame = { title, price, minPlayers, minAge };
    try {
        let obj = await collection.insertOne(newGame);
        res.status(201).json(obj);
    } catch (error) {
        res.status(500).send('Error creating game:', error);
    }
});

// Read (GET) games
app.get('/games', async (req, res) => {
    const collection = db.get('games');
    let limit = parseInt(req.query.limit) || 3;
    limit = Math.min(limit, 7); // Limit to a maximum of 7 games
    try {
        const games = await collection.find().limit(limit).toArray();
        res.json(games);
    } catch (error) {
        res.status(500).send('Error retrieving games:', error);
    }
});

// Delete a game
app.delete('/games/:id', async (req, res) => {
    const collection = db.get('games');
    const id = req.params.id;
    try {
        const result = await collection.deleteOne({ _id: db.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).send('Game not found');
        }
        res.status(200).send('Game deleted');
    } catch (error) {
        res.status(500).send('Error deleting game:', error);
    }
});

process.on('SIGINT', async () => {
    db?.close();
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    db.open();
});
