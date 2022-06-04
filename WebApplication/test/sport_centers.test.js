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
    var admin_name;
    var admin_surname;
    var sport_center1_id;
    var sport_center1_name;
    var admin1_name;
    var admin1_surname;

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

        //POST with valid data
        //store _id and another information about the created resource for future test cases
        test('POST /api/v2/sport_centers with correct data. Should respond with status 201', () => {

            //Prepare a random name to avoid conflicts
            sport_center_name = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);
            admin_name = "Test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);
            admin_surname = "Test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
                .post('/api/v2/sport_centers')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .send({
                    name: admin_name,
                    surname: admin_surname,
                    username: 'carlo.alberto',
                    password: 'carlo.alberto',
                    sport_center: {
                        name: sport_center_name,
                        address: {
                            city: 'CittàTest',
                            location: 'IndirizzoTest'
                        }
                    }
                }) 
                .expect(201)
                .then((response) => {
                    //Get ID of the sport manager just created from location header field
                    //and store it for later test cases
                    let locationHeaderField = response.headers["location"];
                    sport_center_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/')+1);
                });      
        });

        //POST of a resource which already exists
        test('POST /api/v2/sport_centers with correct data but the specified sport_facility already exists. Should respond with status 201', () => {
            return request(app)
                .post('/api/v2/sport_centers')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .send({
                    name: admin_name,
                    surname: admin_surname,
                    username: 'carlo.alberto',
                    password: 'carlo.alberto',
                    sport_center: {
                        name: sport_center_name,
                        address: {
                            city: 'CittàTest',
                            location: 'IndirizzoTest'
                        }
                    }
                }) 
                .expect(409);      
        });

        //POST with valid data
        //store _id and another information about the created resource for future test cases
        test('POST /api/v2/sport_centers with correct data. Should respond with status 201', () => {

            //Prepare a random name to avoid conflicts
            sport_center1_name = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);
            admin1_name = "Test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);
            admin1_surname = "Test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
                .post('/api/v2/sport_centers')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .send({
                    name: admin1_name,
                    surname: admin1_surname,
                    username: 'carlo.alberto',
                    password: 'carlo.alberto',
                    sport_center: {
                        name: sport1_center_name,
                        address: {
                            city: 'CittàTest',
                            location: 'IndirizzoTest'
                        }
                    }
                }) 
                .expect(201)
                .then((response) => {
                    //Get ID of the sport manager just created from location header field
                    //and store it for later test cases
                    let locationHeaderField = response.headers["location"];
                    sport_center1_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/')+1);
                });      
        });
    })

    describe('GET methods tests', () => {
        //GET all the resources
        test('GET /api/v2/sport_centers should respond with status 200', async () => {
            return request(app)
                .get('/api/v2/sport_centers')
                .expect(200)
                .then((response) => {
                    //The length of the response should be at least two due to previous posts
                    expect(response.body.length).toBeGreaterThanOrEqual(2);
                });
        });

        //GET specific resource with not valid ID. Should respond with status 404
        test('GET /api/v2/sport_centers/:id with not valid ID. Should respond with status 404.', async () =>{
            return request(app)
                .get('/api/v2/sport_centers/notValidID')
                .expect(404);
        });

        //GET specific resource with valid ID. Should respond with status 200 and with the data of the previously created resource
        test('GET /api/v2/sport_centers/:id with valid ID. Should respond with status 200 and with the data of the previously created resource', async () => {
            return request(app)
                .get('/api/v2/sport_centers/'+sport_center_id)
                .expect(200)
                .then((response) => {
                    expect(response.body.name).toBe(sport_center_name);
                });
        })
    })

    describe('GET /sport_centers/:id/sport_facilities', () => {

    })

    describe('GET /sport_centers/:id/courses', () => {
        
    })

    describe('GET /sport_centers/:id/managers', () => {
        
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