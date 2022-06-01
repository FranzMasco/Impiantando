const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');

describe('GET /api/v2/sport_centers', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(8000);
        connection = await mongoose.connect(process.env.DB_URL_TEST);
    });
    afterAll( () => { 
        mongoose.connection.close(true);
    });


    //var token = jwt.sign({username: 'antonio.gialli',id: '628501997debfcb7b90be07e'}, process.env.SUPER_SECRET, {expiresIn: 86400});

    test('GET /api/v2/sport_centers should respond with status 200', async () => {
        return request(app).get('/api/v2/sport_centers').expect(200);
    })

    test('GET /api/v2/sport_centers/:id should respond with status 200', async () => {
        return request(app).get('/api/v2/sport_centers/628501997debfcb7b90be07f').expect(200);
    })

    test('GET /api/v2/sport_centers/:id/sport_facilities should respond with status 200', async () => {
        return request(app).get('/api/v2/sport_centers/628501997debfcb7b90be07f/sport_facilities').expect(200);
    })

    test('GET /api/v2/sport_centers/:id/courses should respond with status 200', async () => {
        return request(app).get('/api/v2/sport_centers/628501997debfcb7b90be07f/courses').expect(200);
    })

    test('GET /api/v2/sport_centers/:id/managers should respond with status 200', async () => {
        return request(app).get('/api/v2/sport_centers/628501997debfcb7b90be07f/managers').expect(200);
    })
})