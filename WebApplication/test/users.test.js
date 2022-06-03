const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');
const Users = require('../models/utente');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

describe('/api/v2/users', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(8000);
        connection = await mongoose.connect(process.env.DB_URL_TEST);
    });
    afterAll( () => { 
        mongoose.connection.close(true);
    });

    //Stored information
    var user_id;
    var user_username;

    describe('POST method tests', () => {
        
        //POST with missing required parameter
        test('POST /api/v2/users with required parameters not specified. Should respond with status 400', () => {
            return request(app)
              .post('/api/v2/users')
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(400);
        });

        //POST with valid data
        //store _id and another information about the created resource for future test cases
        test('POST /api/v2/users with correct data. Should respond with status 201', async () => {
            
            //Prepare a random name to avoid conflicts
            user_username = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
              .post('/api/v2/users')
              .set('Accept', 'application/json')
              .send({
                name: "test",
                surname: "test",
                email: "test",
                birth_date: "2000-08-20",
                username: user_username,
                password: "test"
              })
              .expect(201)
              .then((response) => {
                //Get ID of the user just created from location header field
                //and store it for later test cases
                let locationHeaderField = response.headers["location"];
                user_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/') + 1); 
              });
        });

        //POST of a resource which already exists
        test('POST /api/v2/users with correct data but the specified user already exists. Should respond with status 409', () => {
            return request(app)
              .post('/api/v2/users')
              .set('Accept', 'application/json')
              .send({
                name: "test",
                surname: "test",
                email: "test",
                birth_date: "2000-08-20",
                username: user_username,
                password: "test"
              })
              .expect(409);
        });
    })

    /*
    describe('GET methods tests', () => {
        
        //GET specific resource with not valid ID. Should respond with status 404
        test('GET /api/v2/managers/:id with not valid ID. Should respond with status 404.', async () => {
            return request(app)
                .get('/api/v2/managers/notValidID')
                .expect(404);
        })

        //GET specific resource with valid ID. Should respond with status 200 and with the data of the previously created resource
        test('GET /api/v2/managers/:id with valid ID. Should respond with status 200 and with the data of the previously created resource', async () => {
            return request(app)
                .get('/api/v2/managers/'+manager_id)
                .expect(200)
                .then((response) => {
                    expect(response.body.name).toBe(manager_name);
                });
        })

    })
    */
});
