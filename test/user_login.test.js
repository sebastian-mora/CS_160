const supertest = require('supertest');

let app = require('../app');
let test_data = require('./test_data');


describe('Render Login Page', () => {
    it('should get registered user from login route for rendering', async () => {
        const res = await supertest(app).get('/login').send();
        expect(res.statusCode).toEqual(200);
    });
});

describe('Render Register Page', () => {
    it('should login ', async () => {
        const res = await supertest(app).get('/login/register').send();
        expect(res.statusCode).toEqual(200);
    });
});

describe('Login to App', () => {
    it('should redirect non-registered user back to login page', async () => {
        const res = await supertest(app)
            .post('/login')
            .send(test_data.NON_REGISTERED_USER)
            .expect('Location', '/login');
        expect(res.statusCode).toEqual(302);
    });
    it('should redirect already-registered user to their tasks page', async () => {
        const res = await supertest(app)
            .post('/login')
            .send(test_data.REGISTERED_USER)
            .expect('Location', '/tasks');
        expect(res.statusCode).toEqual(302);
    });
});
