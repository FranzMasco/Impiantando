const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');
const facilities = require('../models/facilities');

describe('GET /api/v2/sport_facilities', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(8000);
        connection = await mongoose.connect(process.env.DB_URL_TEST);
    });
    afterAll( () => { 
        mongoose.connection.close(true);
    });

    var id_post="";
    var token = jwt.sign({username: 'antonio.gialli',id: '628501997debfcb7b90be07e'}, process.env.SUPER_SECRET, {expiresIn: 86400});

    test('GET /api/v2/sport_facilities should respond with status 200', async () => {
        return request(app).get('/api/v2/sport_facilities').expect(200);
    })

    test('GET /api/v2/sport_facilities/:id should respond with status 200', async () => {
        return request(app).get('/api/v2/sport_facilities/628371f870f00f63080bd17c').expect(200);
    })

    test('GET /api/v2/sport_facilities/:id/courses should respond with status 404 if the sport facility does not exist', async () => {
        return request(app).get('/api/v2/sport_facilities/628371f870f00f63080bd17b/courses').expect(404);
    })

    test('GET /api/v2/sport_facilities/:id/courses should respond with status 200', async () => {
        return request(app).get('/api/v2/sport_facilities/628371f870f00f63080bd17c/courses').expect(200);
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

    test('POST /api/v2/sport_facilities of a sport facility that does not exist', () => {
        let post = request(app).post('/api/v2/sport_facilities')
        .set('x-access-token', token).set('Accept', 'application/json')
        .send({name: 'Test', description: 'Sport facility inserita attraverso test', id_s_c: '628501997debfcb7b90be07f'});
        return post.expect(201);
    })

    test('DELETE /api/v2/sport_facilities/:id of a sport facility that does not exist', () => {
        return request(app).delete('/api/v2/sport_facilities/628371f870f00f63080bd17b')
        .set('x-access-token', token).set('Accept', 'application/json')
        .expect(404, {status: 'error'});
    })

    /*test('DELETE /api/v2/sport_facilities/:id of a sport facility that exists', () => {
        let sport_facility = facilities.findOne({'name': 'Test'});
        return request(app).delete('/api/v2/sport_facilities/'+sport_facility.id)
        .set('x-access-token', token).set('Accept', 'application/json')
        .expect(204);
    })*/
})