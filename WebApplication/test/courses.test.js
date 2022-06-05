const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

describe('/api/v2/courses', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(10000);
        jest.unmock('mongoose');
        connection = await mongoose.connect(process.env.DB_URL_TEST, {useNewUrlParser: true, useUnifiedTopology: true});
    });
    
    afterAll( async () => {
        await mongoose.connection.close(true);
    });
    

    //Correct token
    var token = jwt.sign({username: 'antonio.gialli',id: '628501997debfcb7b90be07e'}, process.env.SUPER_SECRET, {expiresIn: 86400});

    //Invalid token
    var invalid_token = "This token is not a valid token";

    //Stored information
    var course_id;
    var course_name;
    var course1_id;
    var course1_name;
    var user_id;
    var user_username;
    var manager_id;
    var manager_name;
    

    describe('POST method tests', () => {
        
        //POST with missing required parameter
        test('POST /api/v2/courses with required parameters not specified. Should respond with status 400', () => {
            return request(app)
              .post('/api/v2/courses')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(400);
        });

        //POST without token
        test('POST /api/v2/courses without JSON web token. Should respond with status 401', () => {
            return request(app)
              .post('/api/v2/courses')
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(401);
        });


        //POST with invalid token
        test('POST /api/v2/courses with invalid token. Should respond with status 403', () => {
            return request(app)
              .post('/api/v2/courses')
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(403);
        });

        //POST with valid data
        //store _id and another information about the created resource for future test cases
        test('POST /api/v2/courses with correct data. Should respond with status 201', () => {
            
            //Prepare a random name to avoid conflicts
            course_name = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
              .post('/api/v2/courses')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                name: course_name,
                sport_facility_id: "6283ac8770f00f63080bd17d",
                sport_center_id: "628501997debfcb7b90be07f",
                periodic: true
              })
              .expect(201)
              .then((response) => {
                //Get ID of the course just created from location header field
                //and store it for later test cases
                let locationHeaderField = response.headers["location"];
                course_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/') + 1); 
              });
        });

        //POST of a resource which already exists
        test('POST /api/v2/courses with correct data but the specified course already exists. Should respond with status 409', () => {
            return request(app)
              .post('/api/v2/courses')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                name: course_name,
                sport_facility_id: "6283ac8770f00f63080bd17d",
                sport_center_id: "628501997debfcb7b90be07f",
                periodic: true
              })
              .expect(409);
        });

        //POST with valid data --> create a new instance for later test cases
        test('POST /api/v2/courses with correct data. Should respond with status 201. Create a new instance for later test cases.', () => {
            
            //Prepare a random name to avoid conflicts
            course1_name = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
              .post('/api/v2/courses')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                name: course1_name,
                sport_facility_id: "6283ac8770f00f63080bd17d",
                sport_center_id: "628501997debfcb7b90be07f",
                periodic: true
              })
              .expect(201).then((response) => {
                //Get ID of the course just created from location header field
                //and store it for later test cases
                let locationHeaderField = response.headers["location"];
                course1_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/') + 1); 
              });
        });
    })

    describe('GET methods tests', () => {

        //GET all the resources
        test('GET /api/v2/courses should respond with status 200. At least two resources due to previous POST', () => {
            return request(app)
                .get('/api/v2/courses')
                .expect(200)
                .then((response) => {
                    //The length of the response should be at least two due to previous posts
                    expect(response.body.length).toBeGreaterThanOrEqual(2);
                });
        })

        //GET specific resource with not valid ID. Should respond with status 404
        test('GET /api/v2/courses/:id with not valid ID. Should respond with status 404.', () => {
            return request(app)
                .get('/api/v2/courses/notValidID')
                .expect(404);
        })

        //GET specific resource with valid ID. Should respond with status 200 and with the data of the previously created resource
        test('GET /api/v2/courses/:id with valid ID. Should respond with status 200 and with the data of the previously created resource', () => {
            return request(app)
                .get('/api/v2/courses/'+course_id)
                .expect(200)
                .then((response) => {
                    expect(response.body.name).toBe(course_name);
                });
        })
    })
    
    describe('GET /courses/:id/users method (list of users that attend the course) tests', () => {

        //Mock function
        let responseSpy;
        beforeAll( () => {
            const Users = require('../models/utente');
            responseSpy = jest.spyOn(Users, 'find').mockImplementation(() => {
                return [ 
                    {
                        self: "/api/v2/courses/628672b1083fee9208460bb3",
                        name: "test1",
                        surname: "test1",
                        username: "test1",
                        user: "/api/v2/users/62890e25dd73635189848585"
                    },
                    {
                        self: "/api/v2/courses/628672b1083fee9208460bb3",
                        name: "test2",
                        surname: "test2",
                        username: "test2",
                        user: "/api/v2/users/62890eb7dd73635189848589"
                    }
                ];
            });
        });

        afterAll( () => {
            responseSpy.mockRestore();
        });

        //GET users which attend a given course without token. Should respond with status 401.
        test('GET /api/v2/courses/:id/users without token. Should respond with status 401.', () => {
            return request(app)
                .get('/api/v2/courses/'+course_id+'/users')
                .expect(401);
        })

        //GET users which attend a given course with not valid token. Should respond with status 403.
        test('GET /api/v2/courses/:id/users with not valid token. Should respond with status 403.', () => {
            return request(app)
                .get('/api/v2/courses/'+course_id+'/users')
                .set('x-access-token', invalid_token)
                .set('Accept', 'application/json')
                .expect(403);
        })

        //GET users which attend a given course with not valid ID. Should respond with status 404
        test('GET /api/v2/courses/:id/users with not valid ID. Should respond with status 404.', () => {
            return request(app)
                .get('/api/v2/courses/notValidID/users')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .expect(404);
        })

        //GET users which attend a given course with valid ID. Should respond with an array of users.
        test('GET /api/v2/courses/:id/users with valid data. Should respond with an array of users. Returned data tested with a mock function.', () => {
            return request(app)
                .get('/api/v2/courses/'+course_id+'/users')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    //First element of the response should be "test1"
                    expect(response.body[0].name).toBe("test1");
                });
        })

    })

    describe('GET /courses/:id/participants_number method (get number of users that attend the course) tests', () => {

        //Create a user to be subscribed to the previously created course
        test('POST /api/v2/users Create a user to be subscribed to the previously created course. Should respond with status 201. In this step the ID of the new user is stored.', () => {
            
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

        //Subscribe a user to the previously created course
        test('PATCH /api/v2/registrations with correct data. Should respond with status 200. Subscribe a user to the previously created course for later tests.', () => {
            return request(app)
              .patch('/api/v2/registrations')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  course_id: course_id,
                  user_id: user_id
              })
              .expect(200);
        });


        //GET number of users which attend a given course with not valid ID. Should respond with status 404
        test('GET /api/v2/courses/:id/participants_number (number of users which attend a given course) with not valid ID. Should respond with status 404.', () => {
            return request(app)
                .get('/api/v2/courses/notValidID/participants_number')
                .expect(404);
        })

        //GET number of users which attend a given course with valid ID. Should respond with value greater than or equal to one due to previous test cases.
        test('GET /api/v2/courses/:id/participants_number with valid data. Should respond with value greater than or equal to one due to previous test cases.', () => {
            return request(app)
                .get('/api/v2/courses/'+course_id+'/participants_number')
                .expect(200)
                .then((response) => {
                    //Number of partecipants should be greater than or equal to one due to previous tests
                    expect(response.body.partecipants).toBeGreaterThanOrEqual(1);
                });
        })

    })

    describe('TEST /courses/:id/reviews methods (view latest course reviews and add reviews) tests', () => {

        //Public a review on the previously created course without token. Should respond with status 401.
        test('PATCH /api/v2/courses/:id/reviews - Public a review on the previously created course without token. Should respond with status 401.', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/reviews')
              .set('Accept', 'application/json')
              .send({
                  review: 5
              })
              .expect(401);
        });
        
        //Public a review on the previously created course with invalid token. Should respond with status 403.
        test('PATCH /api/v2/courses/:id/reviews - Public a review on the previously created course with invalid token. Should respond with status 403.', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/reviews')
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  review: 5
              })
              .expect(403);
        });
        
        //Public a review on the previously created course with invalid resource ID. Should respond with status 404.
        test('PATCH /api/v2/courses/:id/reviews - Public a review on the previously created course with invalid resource ID. Should respond with status 404.', () => {
            return request(app)
              .patch('/api/v2/courses/notValidID/reviews')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  review: 5
              })
              .expect(404);
        });

        //Public a review on the previously created course with valid data. Should respond with status 200.
        test('PATCH /api/v2/courses/:id/reviews - Public a review on the previously created course with valid data. Should respond with status 200.', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/reviews')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  review: 5
              })
              .expect(200);
        });

        //Public five new reviews (TOT 6) on the previously created course for later tests
        test('PATCH /api/v2/courses/:id/reviews - Public five [1/5] new reviews (TOT 6) on the previously created course for later tests', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/reviews')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  review: 4
              })
              .expect(200);
        });

        test('PATCH /api/v2/courses/:id/reviews - Public five [2/5] new reviews (TOT 6) on the previously created course for later tests', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/reviews')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  review: 3
              })
              .expect(200);
        });

        test('PATCH /api/v2/courses/:id/reviews - Public five [3/5] new reviews (TOT 6) on the previously created course for later tests', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/reviews')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  review: 2
              })
              .expect(200);
        });

        test('PATCH /api/v2/courses/:id/reviews - Public five [4/5] new reviews (TOT 6) on the previously created course for later tests', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/reviews')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  review: 1
              })
              .expect(200);
        });

        test('PATCH /api/v2/courses/:id/reviews - Public five [5/5] new reviews (TOT 6) on the previously created course for later tests', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/reviews')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  review: 1
              })
              .expect(200);
        });


        //View latest review with invalid ID
        test('GET /api/v2/courses/:id/reviews - Get latest review with invalid resource ID. Should respond with status 404.', () => {
            return request(app)
              .get('/api/v2/courses/notValidID/reviews')
              .expect(404);
        });

        //View latest review about previously created course
        test('GET /api/v2/courses/:id/reviews - Get latest review about previously created course. Should respond with status 200. The response should contain 5 reviews and the most recent one should have vote 1.', () => {
            return request(app)
              .get('/api/v2/courses/'+course_id+'/reviews')
              .expect(200).then((response) => {

                //The response contains exatcly 5 reviews
                expect(response.body.reviews.length).toBe(5);

                //Latest review vote has to be 1
                expect(response.body.reviews[0].vote).toBe(1);

              });
        });
    })

    describe('TEST /courses/:id/news methods (get latest news about the specified course) tests', () => {

        //Public a news about the previously created course with valid data. Should respond with status 200.
        test('POST /api/v2/news - Public a news about the previously created course with valid data. Should respond with status 201.', () => {
            return request(app)
              .post('/api/v2/news/')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  text: "test",
                  course_id: course_id
              })
              .expect(201);
        });

        //Public four new news (TOT 5) on the previously created course for later tests
        test('POST /api/v2/news - Public four [1/4] news (TOT 5) on the previously created course for later tests. Should respond with status 201.', () => {
            return request(app)
              .post('/api/v2/news/')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  text: "test1",
                  course_id: course_id
              })
              .expect(201);
        });

        test('POST /api/v2/news - Public four [2/4] news (TOT 5) on the previously created course for later tests. Should respond with status 201.', () => {
            return request(app)
              .post('/api/v2/news/')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  text: "test2",
                  course_id: course_id
              })
              .expect(201);
        });

        test('POST /api/v2/news - Public four [3/4] news (TOT 5) on the previously created course for later tests. Should respond with status 201.', () => {
            return request(app)
              .post('/api/v2/news/')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  text: "test3",
                  course_id: course_id
              })
              .expect(201);
        });

        test('POST /api/v2/news - Public four [4/4] news (TOT 5) on the previously created course for later tests. Should respond with status 201.', () => {
            return request(app)
              .post('/api/v2/news/')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  text: "test4",
                  course_id: course_id
              })
              .expect(201);
        });


        
        //View latest news with invalid ID
        test('GET /api/v2/courses/:id/news - Get latest news with invalid resource ID. Should respond with status 404.', () => {
            return request(app)
              .get('/api/v2/courses/notValidID/news')
              .expect(404);
        });

        
        //View latest news about previously created course
        test('GET /api/v2/courses/:id/news - Get latest news about previously created course. Should respond with status 200. The response should contain 3 news and the most recent one should have text equal to "test4".', () => {
            return request(app)
              .get('/api/v2/courses/'+course_id+'/news')
              .expect(200).then((response) => {

                //The response contains exatcly 3 news
                expect(response.body.length).toBe(3);

                //Latest news test should be "test4"
                expect(response.body[0]["text"]).toBe("test4");

              });
        });

    })

    describe('TEST /courses/:id/managers methods (view/assign/remove course managers) tests', () => {

        //Create a manager and store his ID
        test('POST /api/v2/managers - Create a manager and store his ID. Should respond with status 201', () => {
            
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

        //Assign manager to a course without token
        test('PATCH /api/v2/courses/:id/managers - Assign manager to a course without token. Should respond with status 401.', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/managers')
              .set('Accept', 'application/json')
              .send({
                  manager_id: manager_id
              })
              .expect(401);
        });

        //Assign manager to a course with a not valid token
        test('PATCH /api/v2/courses/:id/managers - Assign manager to a course with a not valid token. Should respond with status 403.', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/managers')
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  manager_id: manager_id
              })
              .expect(403);
        });

        //Assign manager to a course with a not valid course id
        test('PATCH /api/v2/courses/:id/managers - Assign manager to a course with a not valid course id. Should respond with status 404.', () => {
            return request(app)
              .patch('/api/v2/courses/notValidID/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                manager_id: manager_id
              })
              .expect(404);
        });


        //Assign manager to a course with a not valid manager id
        test('PATCH /api/v2/courses/:id/managers - Assign manager to a course with a not valid manager id. Should respond with status 404.', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                manager_id: "notValid"
              })
              .expect(404);
        });

        //Assign manager to a course with valid data. Should respond with status 200
        test('PATCH /api/v2/courses/:id/managers - Assign manager to a course with valid data. Should respond with status 200.', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id+'/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                manager_id: manager_id
              })
              .expect(200);
        });

        //Remove manager from a course without token
        test('DELETE /api/v2/courses/:id/managers - Remove manager from a course without token. Should respond with status 401.', () => {
            return request(app)
              .delete('/api/v2/courses/'+course_id+'/managers')
              .set('Accept', 'application/json')
              .send({
                  manager_id: manager_id
              })
              .expect(401);
        });

        //Remove manager from a course with a not valid token
        test('DELETE /api/v2/courses/:id/managers - Remove manager from a course with a not valid token. Should respond with status 403.', () => {
            return request(app)
              .delete('/api/v2/courses/'+course_id+'/managers')
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  manager_id: manager_id
              })
              .expect(403);
        });

        //Remove manager from a course with a not valid course id
        test('DELETE /api/v2/courses/:id/managers - Remove manager from a course with a not valid course id. Should respond with status 404.', () => {
            return request(app)
              .delete('/api/v2/courses/notValidID/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                manager_id: manager_id
              })
              .expect(404);
        });

        //Remove manager from a course with a not valid manager id
        test('DELETE /api/v2/courses/:id/managers - Remove manager from a course with a not valid manager id. Should respond with status 404.', () => {
            return request(app)
              .delete('/api/v2/courses/'+course_id+'/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                manager_id: "notValid"
              })
              .expect(404);
        });

        //Remove manager from a course with valid data. Should respond with status 200 
        test('DELETE /api/v2/courses/:id/managers - Remove manager from a course with valid data. Should respond with status 200.', () => {
            return request(app)
              .delete('/api/v2/courses/'+course_id+'/managers')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                manager_id: manager_id
              })
              .expect(200);
        });

        //Delete previously created manager in order to clean the database
        test('DELETE /api/v2/managers/:id - Delete previously created manager in order to clean the database. Should respond with status 204.', () => {
            return request(app)
              .delete('/api/v2/managers/'+manager_id)
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .expect(204);
        });
    })

    describe('PATCH method tests', () => {

        //PATCH without token
        test('PATCH /api/v2/courses/:id without JSON web token. Should respond with status 401', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(401);
        });


        //PATCH with invalid token
        test('PATCH /api/v2/courses/:id with invalid token. Should respond with status 403', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id)
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(403);
        });

        //PATCH with invalid resource id
        test('PATCH /api/v2/courses/:id with invalid id. Should respond with status 404', () => {
            return request(app)
              .patch('/api/v2/courses/notValidID')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(404);
        });

        //PATCH with valid data
        test('PATCH /api/v2/courses/:id with correct data. Should respond with status 200. In the response there must be the updated information.', () => {
            return request(app)
              .patch('/api/v2/courses/'+course_id)
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
        test('DELETE /api/v2/courses/:id without JSON web token. Should respond with status 401', () => {
            return request(app)
              .delete('/api/v2/courses/'+course_id)
              .set('Accept', 'application/json')
              .expect(401);
        });


        //DELETE with invalid token
        test('DELETE /api/v2/courses/:id with invalid token. Should respond with status 403', () => {
            return request(app)
              .delete('/api/v2/courses/'+course_id)
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .expect(403);
        });

        //DELETE with invalid resource id
        test('DELETE /api/v2/courses/:id with invalid id. Should respond with status 404', () => {
            return request(app)
              .delete('/api/v2/courses/notValidID')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .expect(404);
        });

        //DELETE with valid data
        test('DELETE /api/v2/courses/:id with correct data. Should respond with status 204.', () => {
            return request(app)
              .delete('/api/v2/courses/'+course_id)
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .expect(204);
        });

        //DELETE with valid data: delete also the second course created to clean the database
        test('DELETE /api/v2/courses/:id with correct data. Should respond with status 204. Delete the second course created in order to clean the database.', () => {
            return request(app)
              .delete('/api/v2/courses/'+course1_id)
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .expect(204);
        });
    })

});