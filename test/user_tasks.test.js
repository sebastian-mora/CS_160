const supertest = require('supertest');

let app = require('../app');
let test_data = require('./test_data');


describe('Add a Task', () => {
    it('should have 0 existing tasks', async () => {
        const res = await supertest(app).get('/tasks').send();
        expect(res.statusCode).toEqual(200);
    });
    it('should successfully add a task', async () => {

    });
    it('should successfully retrieve the newly added task', async () => {

    });
});

describe('Add a SubTask', () => {
    it('should have failed to add subtask to a non-existing task', async () => {

    });
    it('should successfully add a subtask to an existing task', async () => {

    });
    it('should successfully retrieve the newly added subtask', async () => {

    });
});

describe('Complete a Subtask', () => {
    it('should mark existing subtask as complete', async () => {

    });
    it('should mark non-existing subtask as complete', async () => {

    });
});

describe('Complete a Task', () => {
    it('should mark existing task as complete', async () => {

    });
    it('should mark existing task as complete', async () => {

    });
});

describe('Delete a Task', () => {
    it('should mark existing subtask as complete', async () => {

    });
    it('should have 0 existing tasks after deleting', async () => {
        const res = await supertest(app).get('/tasks').send();
        expect(res.statusCode).toEqual(200);
    });
});
