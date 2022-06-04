const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');
const { response } = require('../app');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

describe('/api/v2/sport_centers', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(8000);
        connection = await mongoose.connect(process.env.DB_URL_TEST);
    });
    afterAll( () => { 
        mongoose.connection.close(true);
    });

    //Correct token
    var token = jwt.sign({username: 'antonio.gialli',id: '628501997debfcb7b90be07e'}, process.env.SUPER_SECRET, {expiresIn: 86400});

    //Invalid token
    var token_not_valid = "This token is not valid";

    //stored information
    var sport_center_id;
    var sport_center_name;
    var sport_center1_id;
    var sport_center1_name;

    describe('POST method tests', () => {

        //POST with missing required parameter
        test('POST /api/v2/sport_facilities with required parameters not specified. Should respond with status 400', () => {
            return request(app)
                .post('/api/v2/sport_centers')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .send({
                    name: 'Carlo',
                    username: 'carlo.alberto',
                    password: 'myPassword'
                })
                .expect(400);
        });

        //POST without token
        test('POST /api/v2/sport_centers without JSON web token. Should respond with status 401', () => {
            return request(app)
                .post('/api/v2/sport_centers')
                .set('Accept', 'application/json')
                .expect(401);
        });

        //POST with invalid token
        test('POST /api/v2/sport_centers with required parameters not specified. Should respond with status 400', () => {
            return request(app)
                .post('/api/v2/sport_centers')
                .set('x-access-token', token_not_valid)
                .set('Accept', 'application/json')
                .expect(403);
        });
    })

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