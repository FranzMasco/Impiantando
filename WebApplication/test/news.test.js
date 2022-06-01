const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');

describe('GET /api/v2/news', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(8000);
        connection = await mongoose.connect(process.env.DB_URL);
    });
    afterAll( () => { 
        mongoose.connection.close(true);
    });


    //var token = jwt.sign({username: 'antonio.gialli',id: '628501997debfcb7b90be07e'}, process.env.SUPER_SECRET, {expiresIn: 86400});

    test('GET /api/v2/news should respond with status 200', async () => {
        request(app).get('/api/v2/news').expect(200);
    })
})