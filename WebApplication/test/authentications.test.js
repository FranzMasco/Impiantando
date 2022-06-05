const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');


describe('/api/v2/authentications', () => {

    //GET specific resource with not valid ID. Should respond with status 404
    test('GET /api/v2/managers/:id with not valid ID. Should respond with status 404.', () => {
        return request(app)
            .get('/api/v2/managers/notValidID')
            .expect(404);
    })

    describe('Administrator authentication tests', () => {

        //Mock function
        let responseSpy;
        beforeAll( () => {
            const AdminUser = require('../models/admin_user');
            responseSpy = jest.spyOn(AdminUser, 'findOne').mockImplementation((input) => {
                if(input.username=="test"){
                return {
                        name: "prova",
                        surname: "prova",
                        email: "prova",
                        birth_date: "2000-08-20",
                        username: "test",
                        password: "password",
                        sport_center: {
                            name: "prova",
                            description: "prova",
                            address: {city: "prova", location: "prova"}
                        }
                    };
                }
            });
        });

        afterAll( () => {
            responseSpy.mockRestore();
        });

        //Authentication with correct username and password
        test('POST /api/v2/authentications/admin with correct username and password. Should respond with status 200. Check BODY parameters: [success: true, user: administrator, username: test]', () => {
            return request(app)
              .post('/api/v2/authentications/admin')
              .set('Accept', 'application/json')
              .send({
                  username: "test",
                  password: "password"
              })
              .expect(200)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(true);
                expect(response.body.user).toBe("administrator");
                expect(response.body.username).toBe("test");
              });
        });

        //Authentication with wrong username
        test('POST /api/v2/authentications/admin with wrong username. Should respond with status 404. Check BODY parameters: [success: false, username: false]', () => {
            return request(app)
              .post('/api/v2/authentications/admin')
              .set('Accept', 'application/json')
              .send({
                  username: "testWrong",
                  password: "password"
              })
              .expect(404)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(false);
                expect(response.body.username).toBe(false);
              });
        });

        //Authentication with wrong password and correct username
        test('POST /api/v2/authentications/admin with wrong password and correct username. Should respond with status 404. Check BODY parameters: [success: false, username: true, password: false]', () => {
            return request(app)
              .post('/api/v2/authentications/admin')
              .set('Accept', 'application/json')
              .send({
                  username: "test",
                  password: "passwordWrong"
              })
              .expect(404)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(false);
                expect(response.body.username).toBe(true);
                expect(response.body.password).toBe(false);
              });
        });
    })

    describe('Manager authentication tests', () => {

        //Mock function
        let responseSpy;
        beforeAll( () => {
            const Responsabile = require('../models/manager_user');
            responseSpy = jest.spyOn(Responsabile, 'findOne').mockImplementation((input) => {
                if(input.username=="test"){
                return {
                        name: "prova",
                        surname: "prova",
                        email: "prova",
                        birth_date: "2000-08-20",
                        username: "test",
                        password: "password"
                    };
                }
            });
        });

        afterAll(() => {
            responseSpy.mockRestore();
        });

        //Authentication with correct username and password
        test('POST /api/v2/authentications/responsabile with correct username and password. Should respond with status 200. Check BODY parameters: [success: true, user: responsabile, username: test]', () => {
            return request(app)
              .post('/api/v2/authentications/responsabile')
              .set('Accept', 'application/json')
              .send({
                  username: "test",
                  password: "password"
              })
              .expect(200)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(true);
                expect(response.body.user).toBe("responsabile");
                expect(response.body.username).toBe("test");
              });
        });

        //Authentication with wrong username
        test('POST /api/v2/authentications/responsabile with wrong username. Should respond with status 404. Check BODY parameters: [success: false, username: false]', () => {
            return request(app)
              .post('/api/v2/authentications/responsabile')
              .set('Accept', 'application/json')
              .send({
                  username: "testWrong",
                  password: "password"
              })
              .expect(404)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(false);
                expect(response.body.username).toBe(false);
              });
        });

        //Authentication with wrong password and correct username
        test('POST /api/v2/authentications/responsabile with wrong password and correct username. Should respond with status 404. Check BODY parameters: [success: false, username: true, password: false]', () => {
            return request(app)
              .post('/api/v2/authentications/responsabile')
              .set('Accept', 'application/json')
              .send({
                  username: "test",
                  password: "passwordWrong"
              })
              .expect(404)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(false);
                expect(response.body.username).toBe(true);
                expect(response.body.password).toBe(false);
              });
        });
    })

    describe('Standard user authentication tests', () => {

        //Mock function
        let responseSpy;
        beforeAll( () => {
            const Utente = require('../models/utente');
            responseSpy = jest.spyOn(Utente, 'findOne').mockImplementation((input) => {
                if(input.username=="test"){
                return {
                        name: "prova",
                        surname: "prova",
                        email: "prova",
                        birth_date: "2000-08-20",
                        username: "test",
                        password: "password"
                    };
                }
            });
        });

        afterAll(() => {
            responseSpy.mockRestore();
        });

        //Authentication with correct username and password
        test('POST /api/v2/authentications/user with correct username and password. Should respond with status 200. Check BODY parameters: [success: true, user: user, username: test]', () => {
            return request(app)
              .post('/api/v2/authentications/user')
              .set('Accept', 'application/json')
              .send({
                  username: "test",
                  password: "password"
              })
              .expect(200)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(true);
                expect(response.body.user).toBe("user");
                expect(response.body.username).toBe("test");
              });
        });

        //Authentication with wrong username
        test('POST /api/v2/authentications/user with wrong username. Should respond with status 404. Check BODY parameters: [success: false, username: false]', () => {
            return request(app)
              .post('/api/v2/authentications/user')
              .set('Accept', 'application/json')
              .send({
                  username: "testWrong",
                  password: "password"
              })
              .expect(404)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(false);
                expect(response.body.username).toBe(false);
              });
        });

        //Authentication with wrong password and correct username
        test('POST /api/v2/authentications/user with wrong password and correct username. Should respond with status 404. Check BODY parameters: [success: false, username: true, password: false]', () => {
            return request(app)
              .post('/api/v2/authentications/user')
              .set('Accept', 'application/json')
              .send({
                  username: "test",
                  password: "passwordWrong"
              })
              .expect(404)
              .then((response) => {
                //Check response
                expect(response.body.success).toBe(false);
                expect(response.body.username).toBe(true);
                expect(response.body.password).toBe(false);
              });
        });
    })
});
