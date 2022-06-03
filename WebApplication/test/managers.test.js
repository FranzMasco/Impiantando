const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');
const Managers = require('../models/manager_user');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

describe('/api/v2/managers', () => {
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
    var invalid_token = "This token is not a valid token";

    //Stored information
    var manager_id;
    var manager_name;

    describe('POST method tests', () => {
        
        //POST with missing required parameter
        test('POST /api/v2/managers with required parameters not specified. Should respond with status 400', () => {
            return request(app)
              .post('/api/v2/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(400);
        });

        //POST without token
        test('POST /api/v2/managers without JSON web token. Should respond with status 401', () => {
            return request(app)
              .post('/api/v2/managers')
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(401);
        });


        //POST with invalid token
        test('POST /api/v2/managers with invalid token. Should respond with status 403', () => {
            return request(app)
              .post('/api/v2/managers')
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(403);
        });

        //POST with valid data
        //store _id and another information about the created resource for future test cases
        test('POST /api/v2/managers with correct data. Should respond with status 201', () => {
            
            //Prepare a random name to avoid conflicts
            manager_name = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
              .post('/api/v2/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                name: manager_name,
                surname: "test",
                email: "test",
                birth_date: "2000-08-20",
                username: "test",
                password: "test",
                society: "test",
                sport_center_id: "628501997debfcb7b90be07f",
              })
              .expect(201)
              .then((response) => {
                //Get ID of the manager just created from location header field
                //and store it for later test cases
                let locationHeaderField = response.headers["location"];
                manager_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/') + 1); 
              });
        });

        //POST of a resource which already exists
        test('POST /api/v2/managers with correct data but the specified manager already exists. Should respond with status 409', () => {
            return request(app)
              .post('/api/v2/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                name: manager_name,
                surname: "test",
                email: "test",
                birth_date: "2000-08-20",
                username: "test",
                password: "test",
                society: "test",
                sport_center_id: "628501997debfcb7b90be07f"
              })
              .expect(409);
        });

        //POST with valid data --> create a new instance for later test cases
        test('POST /api/v2/managers with correct data. Should respond with status 201', () => {
            
            //Prepare a random name to avoid conflicts
            var new_manager_name = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
              .post('/api/v2/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                name: new_manager_name,
                surname: "test",
                email: "test",
                birth_date: "2000-08-20",
                username: "test",
                password: "test",
                society: "test",
                sport_center_id: "628501997debfcb7b90be07f",
              })
              .expect(201);
        });
    })


    describe('GET methods tests', () => {

        //GET all the resources
        test('GET /api/v2/managers should respond with status 200. At least two resources due to previous POST', async () => {
            return request(app)
                .get('/api/v2/managers')
                .expect(200)
                .then((response) => {
                    //The length of the response should be at least two due to previous posts
                    expect(response.body.length).toBeGreaterThanOrEqual(2);
                });
        })
        
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


    describe('PATCH method tests', () => {

        //PATCH without token
        test('PATCH /api/v2/managers/:id without JSON web token. Should respond with status 401', () => {
            return request(app)
              .patch('/api/v2/managers/'+manager_id)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(401);
        });


        //PATCH with invalid token
        test('PATCH /api/v2/managers/:id with invalid token. Should respond with status 403', () => {
            return request(app)
              .patch('/api/v2/managers/'+manager_id)
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(403);
        });

        //PATCH with invalid resource id
        test('PATCH /api/v2/managers/:id with invalid id. Should respond with status 404', () => {
            return request(app)
              .patch('/api/v2/managers/notValidID')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(404);
        });

        //PATCH with valid data
        test('PATCH /api/v2/managers/:id with correct data. Should respond with status 200. In the response there must be the updated information.', () => {
            return request(app)
              .patch('/api/v2/managers/'+manager_id)
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                name: "new_name",
              })
              .expect(200)
              .then((response) => {
                //Check updated data
                expect(response.body.name).toBe("new_name");
              });
        });
    })

    describe('DELETE method tests', () => {

        //DELETE without token
        test('DELETE /api/v2/managers/:id without JSON web token. Should respond with status 401', () => {
            return request(app)
              .delete('/api/v2/managers/'+manager_id)
              .set('Accept', 'application/json')
              .expect(401);
        });


        //DELETE with invalid token
        test('DELETE /api/v2/managers/:id with invalid token. Should respond with status 403', () => {
            return request(app)
              .delete('/api/v2/managers/'+manager_id)
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .expect(403);
        });

        //DELETE with invalid resource id
        test('DELETE /api/v2/managers/:id with invalid id. Should respond with status 404', () => {
            return request(app)
              .delete('/api/v2/managers/notValidID')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .expect(404);
        });

        //DELETE with valid data
        test('DELETE /api/v2/managers/:id with correct data. Should respond with status 204.', () => {
            return request(app)
              .delete('/api/v2/managers/'+manager_id)
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .expect(204);
        });
    })    
});
