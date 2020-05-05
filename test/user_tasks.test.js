const supertest = require('supertest');

let app = require('../app');
let test_data = require('./test_data');


async function postNewTask(userId, taskJson) {
    var res = await supertest(app).post('/tasks').set('Accept', 'application/json');
    res.cookie('userid', userId);
    res.send(taskJson);

    expect(res.statusCode).toEqual(200);
    return res;
}

async function requestTask(userId, taskId) {
    var res = await supertest(app).get('/tasks/' + taskId);
    res.cookie('userid', userid);
    res.send();

    expect(res.statusCode).toEqual(200);
    return res;
}

async function requestAllTasks(userId) {
    var res = await supertest(app).get('/tasks');
    res.cookie('userid', userid);
    res.send();

    expect(res.statusCode).toEqual(200);
    return res;
}

describe('Add a Task', () => {
    it('should have 0 existing tasks', async () => {
        const tasks = await requestAllTasks(test_data.REGISTERED_USER.id);
        expect(Object.keys(tasks).length).toEqual(0);
    });

    it('should successfully add a task', async () => {
        postNewTask(test_data.REGISTERED_USER.id, test_data.EXAMPLE_TASK_1);
    });
    it('should have 1 existing tasks', async () => {
        const tasks = await requestAllTasks(test_data.REGISTERED_USER.id);
        expect(Object.keys(tasks).length).toEqual(1);
    });
});
