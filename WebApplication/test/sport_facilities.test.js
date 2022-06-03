const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');
const Facilities = require('../models/facilities');
const { response } = require('../app');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
  
describe('/api/v2/sport_facilities', () => {
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
    var sport_facility_id;
    var sport_facility_name;
    var sport_facility1_id;
    var sport_facility1_name;

    describe('POST method tests', () => {

        //POST with missing required parameter
        test('POST /api/v2/sport_facilities with required parameters not specified. Should respond with status 400', () => {
            return request(app)
                .post('/api/v2/sport_facilities')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .expect(400);
        });

        //POST without token
        test('POST /api/v2/sport_facilities without JSON web token. Should respond with status 401', () => {
            return request(app)
                .post('/api/v2/sport_facilities')
                .set('Accept', 'application/json')
                .expect(401);
        });

        //POST with invalid token
        test('POST /api/v2/sport_facilities with required parameters not specified. Should respond with status 400', () => {
            return request(app)
                .post('/api/v2/sport_facilities')
                .set('x-access-token', token_not_valid)
                .set('Accept', 'application/json')
                .expect(403);
        });

        //POST with valid data
        //store _id and another information about the created resource for future test cases
        test('POST /api/v2/sport_facilities with correct data. Should respond with status 201', () => {

            //Prepare a random name to avoid conflicts
            sport_facility_name = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
                .post('/api/v2/sport_facilities')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .send({
                    name: sport_facility_name, 
                    description: 'Sport facility inserita attraverso test', 
                    id_s_c: '628501997debfcb7b90be07f'
                }) 
                .expect(201)
                .then((response) => {
                    //Get ID of the sport manager just created from location header field
                    //and store it for later test cases
                    let locationHeaderField = response.headers["location"];
                    sport_facility_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/')+1);
                });
        });

        //POST of a resource which already exists
        test('POST /api/v2/sport_facilities with correct data but the specified sport_facility already exists. Should respond with status 409', () => {
            return request(app)
                .post('/api/v2/sport_facilities')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .send({
                    name: sport_facility_name, 
                    description: 'Sport facility inserita attraverso test', 
                    id_s_c: '628501997debfcb7b90be07f'
                }) 
                .expect(409);
        });

        //POST with valid data --> create a new instance for later test cases
        test('POST /api/v2/sport_facilities with correct data. Should respond with status 201', () => {

            //Prepare a random name to avoid conflicts
            var new_sport_facility_name = "test"+getRandomIntInclusive(0,1000000)+getRandomIntInclusive(0,1000000);

            return request(app)
                .post('/api/v2/sport_centers')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .send({
                    name: new_sport_facility_name, 
                    description: 'Sport facility inserita attraverso test', 
                    id_s_c: '628501997debfcb7b90be07f'
                })
                .expect(201);
        });
    })

    describe('GET methods tests', () => {

        //GET all the resources
        test('GET /api/v2/sport_facilities should respond with status 200', async () => {
            return request(app)
                .get('/api/v2/sport_facilities')
                .expect(200)
                .then((response) => {
                    //The length of the response should be at least two due to previous posts
                    expect(response.body.length).toBeGreaterThanOrEqual(2);
            });
        })
        
        //GET specific resource with not valid ID. Should respond with status 404
        test('GET /api/v2/sport_facilities/:id with not valid ID. Should respond with status 404.', async () => {
            return request(app)
                .get('/api/v2/sport_facilities/notValidID')
                .expect(404);
        })

        //GET specific resource with valid ID. Should respond with status 200 and with the data of the previously created resource
        test('GET /api/v2/sport_facilities/:id with valid ID. Should respond with status 200 and with the data of the previously created resource', async () => {
            return request(app)
                .get('/api/v2/sport_facilities/'+sport_facility_id)
                .expect(200)
                .then((response) => {
                    expect(response.body.name).toBe(sport_facility_name);
                });
        })
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

    
})