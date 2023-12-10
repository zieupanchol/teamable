const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { isInvalidEmail, isEmptyPayload } = require('./validator');

const { DB_USER, DB_PASS, DEV } = process.env;

/*if (DEV) {
    const url = 'mongodb://localhost:27017'
}
else {
    const url = `mongodb://${DB_USER}:${DB_PASS}@localhost:27017?authSource=company_db`;

}*/
const dbAddress = 'localhost:27017'
const url = DEV ? `mongodb://${dbAddress}` :`mongodb://${DB_USER}:${DB_PASS}@localhost:27017?authSource=company_db`

//const url = 'mongodb://localhost:27017'

// Connection URL
const client = new MongoClient(url);
// Database Name
const dbName = 'company_db';

//collection name
const collName = 'employees';

const port = 3000;

const app = express();

app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/dist'));

app.get('/get-user-profile', async (req, res) => {

    //connect to mongodb database
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');

    // get the db and collection
    const db = client.db(dbName);
    const collection = db.collection(collName);
    // get data from mongodb database
    const result = await collection.findOne({ id: 1 })
    console.log(result)
    client.close()

    response = {}
    if (result !== null) {
        response = {
            name: result.name,
            email: result.email,
            interests: result.interests
        }
    }

    res.send(response)

})

app.post('/save-user-profile', async (req, res) => {
    const payload = req.body
    console.log(payload)

    if (isEmptyPayload(payload) || isInvalidEmail(payload)) {
        res.send({ error: "Invalid paylaod. Couldn't update user profile data" })
    }
    else {
        //connect to mongodb database
        await client.connect();
        console.log('Connected successfully to server');
        //get the db and collection
        const db = client.db(dbName);
        const collection = db.collection(collName);
        //save data to database

        payload['id'] = 1;
        const updatedValues = { $set: payload }
        await collection.updateOne({ id: 1 }, updatedValues, { upsert: true });
        client.close()
        //await collection.updateOne({ id: 1 }, updatedValues);


        res.send({ info: "user data has been saved successfully" })
    }

})

const server = app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
})


module.exports = { app, server }