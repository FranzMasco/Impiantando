const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');

describe('GET /api/v2/sport_facilities', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(8000);
        connection = await mongoose.connect(process.env.DB_URL_TEST);
    });
    afterAll( () => { 
        mongoose.connection.close(true);
    });


    var token = jwt.sign({username: 'antonio.gialli',id: '628501997debfcb7b90be07e'}, process.env.SUPER_SECRET, {expiresIn: 86400});

    test('GET /api/v2/sport_facilities should respond with status 200', async () => {
        request(app).get('/api/v2/sport_facilities').expect(200);
    })

    test('POST /api/v2/sport_facilities without a name specified', () =>{
        return request(app).post('/api/v2/sport_facilities')
        .set('x-access-token', token).set('Accept', 'application/json')
        .expect(400, { error: 'Name not specified'});
    });

    test('POST /api/v2/sport_facilities of a sport facility already existing in a sport center', () => {
        return request(app).post('/api/v2/sport_facilities')
        .set('x-access-token', token).set('Accept', 'application/json')
        .send({name: 'Piscina', id_s_c: '628501997debfcb7b90be07f'})
        .expect(409);
    })
})