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
        jest.setTimeout(50000);
        jest.unmock('mongoose');
        connection = await mongoose.connect(process.env.DB_URL_TEST, {useNewUrlParser: true, useUnifiedTopology: true});
    });
    
    afterAll( async () => {
        await mongoose.connection.close(true);
    });

    //Correct token
    var token = jwt.sign({username: 'antonio.gialli',id: '628501997debfcb7b90be07e'}, process.env.SUPER_SECRET, {expiresIn: 86400});

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
                        name: sport_center1_name,
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
        //Mock function
        let responseSpy;
        beforeAll(()=>{
            const Facilities = require('../models/facilities');
            responseSpy = jest.spyOn(Facilities, 'find').mockImplementation(()=>{
                return [
                    {
                        self: "/api/v2/sport_facilities/628672b1083fee9208460bb3",
                        name: "FacilityTest",
                        description: "DescriptionTest",
                        sport_center_id: sport_center1_id
                    },
                    {
                        self: "/api/v2/sport_facilities/628672b1083fee9208460bb4",
                        name: "Campo da Tennis",
                        description: "Descrizione campo da tennis",
                        sport_center_id: sport_center1_id
                    }
                ]
            })
        });

        afterAll(async () => {
            responseSpy.mockRestore();
        });

        //GET sport_facility in a specific sport_center with not valid ID. Should respond with status 404
        test('GET /api/v2/sport_centers/:id/sport_facilities with not valid ID. Should respond with status 404.', async () => {
            return request(app)
                .get('/api/v2/sport_centers/notValidID/sport_facilities')
                .expect(404);
        })

        //GET courses in a specific sport_center with valid ID. Should respond with an array of courses
        test('GET /api/v2/sport_centers/:id/sport_facilities should respond with status 200', async () => {
            return request(app)
                .get('/api/v2/sport_centers/'+sport_center1_id+'/sport_facilities')
                .expect(200)
                .then((response) => {
                    expect(response.body[0].name).toBe("FacilityTest");
                });
        })
    })

    describe('GET /sport_centers/:id/courses', () => {
        //Mock function
        let responseSpy;
        beforeAll(()=>{
            const Courses = require('../models/course');
            responseSpy = jest.spyOn(Courses, 'find').mockImplementation(()=>{
                return [
                    {
                        self: "/api/v2/courses/628672b1083fee9208460bb3",
                        name: "CorsoTest",
                        managers: [],
                        sport_center_id: sport_center1_id
                    },
                    {
                        self: "/api/v2/courses/628672b1083fee9208460bb4",
                        name: "Corso di tennis",
                        managers: [],
                        sport_center_id: sport_center1_id
                    }
                ]
            })
        });

        afterAll(async () => {
            responseSpy.mockRestore();
        });

        //GET courses in a specific sport_center with not valid ID. Should respond with status 404
        test('GET /api/v2/sport_centers/:id/courses with not valid ID. Should respond with status 404.', async () => {
            return request(app)
                .get('/api/v2/sport_centers/notValidID/courses')
                .expect(404);
        })

        //GET courses in a specific sport_center with valid ID. Should respond with an array of courses
        test('GET /api/v2/sport_centers/:id/courses should respond with status 200', async () => {
            return request(app)
                .get('/api/v2/sport_centers/'+sport_center1_id+'/courses')
                .expect(200)
                .then((response) => {
                    expect(response.body[0].name).toBe("CorsoTest");
                });
        })
    })

    describe('GET /sport_centers/:id/managers', () => {
        //Mock function
        let responseSpy;
        beforeAll(()=>{
            const Managers = require('../models/manager_user');
            responseSpy = jest.spyOn(Managers, 'find').mockImplementation(()=>{
                return [
                    {
                        self: "/api/v2/managers/628672b1083fee9208460bb3",
                        name: 'test',
                        surname: "test",
                        email: "test",
                        birth_date: "2000-08-20",
                        username: "test",
                        password: "test",
                        society: "test",
                        courses: [],
                        sport_center_id: sport_center1_id,
                    },
                    {
                        self: "/api/v2/managers/628672b1083fee9208460bb4",
                        name: 'test1',
                        surname: "test1",
                        email: "test1",
                        birth_date: "2000-08-20",
                        username: "test1",
                        password: "test1",
                        society: "test1",
                        courses: [],
                        sport_center_id: sport_center1_id,
                    }
                ]
            })
        });

        afterAll(async () => {
            responseSpy.mockRestore();
        });

        //GET managers in a specific sport_center with not valid ID. Should respond with status 404
        test('GET /api/v2/sport_centers/:id/managers with not valid ID. Should respond with status 404.', async () => {
            return request(app)
                .get('/api/v2/sport_centers/notValidID/managers')
                .expect(404);
        })

        //GET courses in a specific sport_facility with valid ID. Should respond with an array of courses
        test('GET /api/v2/sport_centers/:id/managers should respond with status 200', async () => {
            return request(app)
                .get('/api/v2/sport_centers/'+sport_center1_id+'/managers')
                .expect(200)
                .then((response) => {
                    expect(response.body[0].name).toBe("test");
                });
        })

    })
})