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

/*
beforeAll(done => {
    done()
})
  
afterAll(done => {
    done()
    mongoose.disconnect();
})
*/

describe('/api/v2/users', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect(process.env.DB_URL_TEST, {useNewUrlParser: true, useUnifiedTopology: true});
    });
    
    afterAll( async () => {
        await mongoose.connection.close(true);
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
        test('POST /api/v2/users with correct data. Should respond with status 201', () => {
            
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
    
    describe('GET methods tests', () => {
        //Mock function
        let responseSpy;
        beforeAll( () => {
            const Courses = require('../models/course');
            responseSpy = jest.spyOn(Courses, 'find').mockImplementation(() => {
                return [ 
                    {
                        self: "/api/v2/courses/628672b1083fee9208460bb3",
                        name: "CorsoTest",
                        managers: []
                    },
                    {
                        self: "/api/v2/courses/628672b1083fee9208460bb4",
                        name: "Corso di tennis",
                        managers: []
                    }
                ];
            });
        });

        afterAll( () => {
            responseSpy.mockRestore();
        });

        //GET specific resource with not valid ID. Should respond with status 404
        test('GET /api/v2/users/:id with not valid ID. Should respond with status 404.', () => {
            return request(app)
                .get('/api/v2/users/notValidID')
                .expect(404);
        })

        
        //GET specific resource with valid ID. Should respond with status 200 and with the data of the previously created resource
        test('GET /api/v2/users/:id with valid ID. Should respond with status 200 and with the data of the previously created resource', () => {
            return request(app)
                .get('/api/v2/users/'+user_id)
                .expect(200)
                .then((response) => {
                    expect(response.body.username).toBe(user_username);
                });
        })

        //GET courses attended by a specific user with not valid ID. Should respond with status 404
        test('GET /api/v2/users/:id/courses with not valid ID. Should respond with status 404.', () => {
            return request(app)
                .get('/api/v2/users/notValidID/courses')
                .expect(404);
        })

        //GET courses attended by a specific user with valid ID. Should respond with an array of courses
        test('GET /api/v2/users/:id/courses with valid ID. Should respond with an array of courses. Returned data tested with a mock function.', () => {
            return request(app)
                .get('/api/v2/users/'+user_id+'/courses')
                .expect(200)
                .then((response) => {
                    //First element of the response should be "CorsoTest"
                    expect(response.body[0].name).toBe("CorsoTest");
                });
        })
    })
});
