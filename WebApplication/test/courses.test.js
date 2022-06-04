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
});