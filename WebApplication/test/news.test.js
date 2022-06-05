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

describe('/api/v2/news', () => {
    let connection;
    
    beforeAll( async() => {
        jest.setTimeout(50000);
        jest.unmock('mongoose');
        connection = await mongoose.connect(process.env.DB_URL_TEST, {useNewUrlParser: true, useUnifiedTopology: true});
    });
    
    afterAll( async () => {
        await mongoose.connection.close(true);
    });

    //Correct token
    var token = jwt.sign({username: 'luca.lech',id: '6288c4a7ca2449bb5526a51f'}, process.env.SUPER_SECRET, {expiresIn: 86400});

    //Invalid token
    var token_not_valid = "This token is not valid";

    //sotred information
    var news_id;
    var news1_id;

    describe('POST method tests', () => {

        //POST with missing required parameter
        test('POST /api/v2/news with required parameters not specified. Should respond with status 400', () => {
            return request(app)
                .post('/api/v2/news')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .expect(400);
        });

        //POST without token
        test('POST /api/v2/news without JSON web token. Should respond with status 401', () => {
            return request(app)
                .post('/api/v2/news')
                .set('Accept', 'application/json')
                .expect(401);
        });

        //POST with invalid token
        test('POST /api/v2/news with required parameters not specified. Should respond with status 400', () => {
            return request(app)
                .post('/api/v2/news')
                .set('x-access-token', token_not_valid)
                .set('Accept', 'application/json')
                .expect(403);
        });

        //POST with valid data
        //store _id and another information about the created resource for future test cases
        test('POST /api/v2/news with correct data. Should respond with status 201', () => {

            return request(app)
                .post('/api/v2/news')
                .set('x-access-token', token)
                .set('Accept', 'application/json')
                .send({
                    text: "test1",
                    course_id: '628672b1083fee9208460bb3'
                }) 
                .expect(201)
                .then((response) => {
                    //Get ID of the sport manager just created from location header field
                    //and store it for later test cases
                    let locationHeaderField = response.headers["location"];
                    news_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/')+1);
                });
        });

        //POST with valid data
        //store _id and another information about the created resource for future test cases
        test('POST /api/v2/news with correct data. Should respond with status 201', async () => {
            return request(app)
              .post('/api/v2/news')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                text: "test2",
                course_id: '628672b1083fee9208460bb3'
              })
              .expect(201)
              .then((response) => {
                //Get ID of the manager just created from location header field
                //and store it for later test cases
                let locationHeaderField = response.headers["location"];
                news1_id = locationHeaderField.substring(locationHeaderField.lastIndexOf('/') + 1); 
              });
        });
    })

    describe('GET methods tests', () => {
        //GET all the resources
        test('GET /api/v2/news should respond with status 200', async () => {
            return request(app)
                .get('/api/v2/news')
                .expect(200)
                .then((response) => {
                    //The length of the response should be at least two due to previous posts
                    expect(response.body.length).toBeGreaterThanOrEqual(2);
            });
        })

        //GET specific resource with not valid ID. Should respond with status 404
        test('GET /api/v2/news/:id with not valid ID. Should respond with status 404.', async () => {
            return request(app)
                .get('/api/v2/news/notValidID')
                .expect(404);
        })

        //GET specific resource with valid ID. Should respond with status 200 and with the data of the previously created resource
        test('GET /api/v2/news/:id with valid ID. Should respond with status 200 and with the data of the previously created resource', async () => {
            return request(app)
                .get('/api/v2/news/'+news_id)
                .expect(200)
                .then((response) => {
                    expect(response.body.text).toBe('test1');
                });
        })
    })

    describe('PATCH method tests', () => {
        //PATCH without token
        test('PATCH /api/v2/news/:id without JSON web token. Should respond with status 401', () => {
            return request(app)
              .patch('/api/v2/news/'+news_id)
              .set('Accept', 'application/json')
              .send({
                  name: "test"
              })
              .expect(401);
        });

        //PATCH with invalid token
        test('PATCH /api/v2/news/:id with invalid token. Should respond with status 403', () => {
            return request(app)
              .patch('/api/v2/news/'+news_id)
              .set('x-access-token', token_not_valid)
              .set('Accept', 'application/json')
              .send({
                  text: "test"
              })
              .expect(403);
        });

        //PATCH with invalid resource id
        test('PATCH /api/v2/news/:id with invalid id. Should respond with status 404', () => {
            return request(app)
              .patch('/api/v2/news/notValidID')
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                  text: "test"
              })
              .expect(404);
        });

        //PATCH with valid data
        test('PATCH /api/v2/news/:id with correct data. Should respond with status 200. In the response there must be the updated information.', () => {
            return request(app)
              .patch('/api/v2/news/'+news_id)
              .set('x-access-token', token)
              .set('Accept', 'application/json')
              .send({
                text: "new_text",
              })
              .expect(200)
              .then((response) => {
                //Check updated data
                expect(response.body.text).toBe("new_text");
              });
        });
    })

    describe('DELETE method tests', () => {
        //DELETE without token
        test('DELETE /api/v2/news/:id without JSON web token. Should respond with status 401', () => {
            return request(app)
                .delete('/api/v2/news/'+news_id)
                .set('Accept', 'application/json')
                .expect(401);
        });

        //DELETE with invalid token
        test('DELETE /api/v2/news/:id with invalid token. Should respond with status 403', () => {
            return request(app)
                .delete('/api/v2/news/'+news_id)
                .set('x-access-token', token_not_valid)
                .set('Accept', 'application/json')
                .expect(403);
        });

        //DELETE with invalid resource id
        test('DELETE /api/v2/news/:id of a news that does not exist', () => {
            return request(app)
            .delete('/api/v2/news/notValidID')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(404);
        });

        //DELETE with valid data
        test('DELETE /api/v2/news/:id of a news that exists', () => {
            return request(app)
            .delete('/api/v2/news/'+news_id)
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(204);
        })

        //DELETE with valid data
        test('DELETE /api/v2/news/:id of a news that exists', () => {
            return request(app)
            .delete('/api/v2/news/'+news1_id)
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(204);
        })
    })  
})