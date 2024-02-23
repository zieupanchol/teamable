const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { isInvalidEmail, isEmptyPayload } = require('./validator');

const { DB_USER, DB_PASS, DEV } = process.env;
const dbAddress = 'localhost:27017';
//const url = DEV ? `mongodb://${dbAddress}` : `mongodb://${DB_USER}:${DB_PASS}@localhost:27017?authSource=company_db`;
const url = DEV ? `mongodb://admin:password@localhost:27017` : `mongodb://admin:password@mongodb`;
// use when starting application as docker container, part of docker-compose
//let mongoUrlDockerCompose = "mongodb://admin:password@mongodb";

const dbName = 'company_db';
const collName = 'employees';
const port = 3000;
const app = express();
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/dist'));

//const client = new MongoClient(url);
const client = new MongoClient(url);

app.get('/get-user-profile', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collName);
        const result = await collection.findOne({ id: 1 });
        console.log(result);
        client.close();
        const response = result ? {
            name: result.name,
            email: result.email,
            interests: result.interests
        } : {};
        res.send(response);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send({ error: 'An error occurred while fetching user profile' });
    }
});

app.post('/save-user-profile', async (req, res) => {
    try {
        const payload = req.body;
        console.log(payload);
        if (isEmptyPayload(payload) || isInvalidEmail(payload)) {
            res.status(400).send({ error: "Invalid payload. Couldn't update user profile data" });
            return;
        }
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collName);
        payload['id'] = 1;
        const updatedValues = { $set: payload };
        await collection.updateOne({ id: 1 }, updatedValues, { upsert: true });
        client.close();
        res.send({ info: "User data has been saved successfully" });
    } catch (error) {
        console.error('Error saving user profile:', error);
        res.status(500).send({ error: 'An error occurred while saving user profile' });
    }
});

const server = app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

module.exports = { app, server };
