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

    /*
    var token = jwt.sign({username: 'antonio.gialli',id: '628501997debfcb7b90be07e'}, process.env.SUPER_SECRET, {expiresIn: 86400});
    describe('GET methods tests', () => {
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
    })

    describe('POST method tests', () => {
        test('POST /api/v2/sport_facilities without a name specified', () =>{
            return request(app).post('/api/v2/sport_facilities')
            .set('x-access-token', token).set('Accept', 'application/json')
            .expect(400, "Bad input - missing required information");
        });
    
        test('POST /api/v2/sport_facilities of a sport facility already existing in a sport center', () => {
            return request(app).post('/api/v2/sport_facilities')
            .set('x-access-token', token).set('Accept', 'application/json')
            .send({name: 'Piscina', id_s_c: '628501997debfcb7b90be07f'})
            .expect(409);
        })
    })

    describe('POST method funzionante', () => {
        let test_facility_post
        beforeAll( async() => {
            let test_facility_post_name = 'Test'+getRandomIntInclusive(0,1000000)+''+getRandomIntInclusive(0,1000000);
            
            test_facility_post = {
                name: test_facility_post_name, description: 'Sport facility inserita attraverso test', id_s_c: '628501997debfcb7b90be07f'
            };
            //console.log(test_facility_post)
        })
        
        test('POST /api/v2/sport_facilities of a sport facility that does not exist', () => {
            let post = request(app).post('/api/v2/sport_facilities')
            .set('x-access-token', token).set('Accept', 'application/json')
            .send(test_facility_post);
            return post.expect(201);
        })
    })

    describe('DELETE methods test', () => {
        test('DELETE /api/v2/sport_facilities/:id of a sport facility that does not exist', () => {
            return request(app).delete('/api/v2/sport_facilities/628371f870f00f63080bd17b')
            .set('x-access-token', token).set('Accept', 'application/json')
            .expect(404, {status: 'error'});
        })
    })
    
    describe('DELETE method successfull', () => {
        let test_facility_post, test_facility;
        beforeAll( async() => {
            test_facility_post = new Facilities({
                name: 'Test', description: 'Sport facility inserita attraverso test', id_s_c: '628501997debfcb7b90be07f'
            });
            test_facility = await test_facility_post.save();
        })
    
        test('DELETE /api/v2/sport_facilities/:id of a sport facility that exists', () => {
            //let sport_facility = facilities.findOne({'name': 'Test'});
            return request(app).delete('/api/v2/sport_facilities/'+test_facility.id)
            .set('x-access-token', token).set('Accept', 'application/json')
            .expect(204);
        })
    })
    */
    
});