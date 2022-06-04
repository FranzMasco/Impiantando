const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

describe('/api/v2/subscriptions', () => {
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
    var user_id;
    var course_id;
    var user_username;
    var course_name;

    describe('Registration tests', () => {
        
        //POST new course --> save identifier
        test('POST /api/v2/courses with correct data in order to register a new course for later tests. Should respond with status 201. In this step the ID of the new course is stored.', async () => {
            
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

        //POST new user --> save identifier
        test('POST /api/v2/users with correct data in order to register a new user for later tests. Should respond with status 201. In this step the ID of the new user is stored.', async () => {
            
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

        /*Register the previously created user to the previously created course*/
        
        //PATCH without token
        test('PATCH /api/v2/registrations without JSON web token. Should respond with status 401', () => {
            return request(app)
              .patch('/api/v2/registrations')
              .set('Accept', 'application/json')
              .send({
                  course_id: course_id,
                  user_id: user_id
              })
              .expect(401);
        });


        //PATCH with invalid token
        test('PATCH /api/v2/registrations with invalid token. Should respond with status 403', () => {
            return request(app)
              .patch('/api/v2/registrations')
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  course_id: course_id,
                  user_id: user_id
              })
              .expect(403);
        });

        //PATCH with invalid course id
        test('PATCH /api/v2/registrations with invalid course id. Should respond with status 404', () => {
            return request(app)
              .patch('/api/v2/registrations')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                course_id: "notValidID",
                user_id: user_id
              })
              .expect(404);
        });

        //PATCH with invalid user id
        test('PATCH /api/v2/registrations with invalid user id. Should respond with status 404', () => {
            return request(app)
              .patch('/api/v2/registrations')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                course_id: course_id,
                user_id: "notValidID"
              })
              .expect(404);
        });

        //PATCH with missing required information
        test('PATCH /api/v2/registrations with missing required information. Should respond with status 400', () => {
            return request(app)
              .patch('/api/v2/registrations')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                course_id: course_id
              })
              .expect(400);
        });

        //Registration with valid data
        test('PATCH /api/v2/registrations with correct data. Should respond with status 200.', async () => {
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

    })

    describe('Unsubscription test', () => {

        /*Unsubscribe the previously created user from the previously created course*/
        
        //PATCH without token
        test('PATCH /api/v2/unsubscribe without JSON web token. Should respond with status 401', () => {
            return request(app)
              .patch('/api/v2/unsubscribe')
              .set('Accept', 'application/json')
              .send({
                  course_id: course_id,
                  user_id: user_id
              })
              .expect(401);
        });


        //PATCH with invalid token
        test('PATCH /api/v2/unsubscribe with invalid token. Should respond with status 403', () => {
            return request(app)
              .patch('/api/v2/unsubscribe')
              .set('x-access-token', invalid_token)
              .set('Accept', 'application/json')
              .send({
                  course_id: course_id,
                  user_id: user_id
              })
              .expect(403);
        });

        //PATCH with invalid course id
        test('PATCH /api/v2/unsubscribe with invalid course id. Should respond with status 404', () => {
            return request(app)
              .patch('/api/v2/unsubscribe')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                course_id: "notValidID",
                user_id: user_id
              })
              .expect(404);
        });

        //PATCH with invalid user id
        test('PATCH /api/v2/unsubscribe with invalid user id. Should respond with status 404', () => {
            return request(app)
              .patch('/api/v2/unsubscribe')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                course_id: course_id,
                user_id: "notValidID"
              })
              .expect(404);
        });

        //PATCH with missing required information
        test('PATCH /api/v2/unsubscribe with missing required information. Should respond with status 400', () => {
            return request(app)
              .patch('/api/v2/unsubscribe')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                course_id: course_id
              })
              .expect(400);
        });

        //Unsubscription with valid data
        test('PATCH /api/v2/unsubscribe with correct data. Should respond with status 200.', async () => {
            return request(app)
              .patch('/api/v2/unsubscribe')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  course_id: course_id,
                  user_id: user_id
              })
              .expect(200);
        });

        //DELETE the previously created course in order to clean the database 
        test('DELETE /api/v2/courses/:id with correct data. Delete previously created course in order to clean the database. Should respond with status 204.', () => {
            return request(app)
              .delete('/api/v2/courses/'+course_id)
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .expect(204);
        });
    })
});