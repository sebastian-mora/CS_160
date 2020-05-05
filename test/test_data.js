const NON_REGISTERED_USER = {
    id:       -1,
    email:    '',
    name:     '',
    password: ''
}
const REGISTERED_USER = {
    id:       2,
    email:    'asd',
    name:     'asd',
    password: 'asd'
}
const EXAMPLE_TASK_1 = {
    date_due:    '2020-05-20',
    title:       'Math HWs',
    description: 'Mymathlab section 3.5',
    priority:    'high',
    status:      'open',
    tag:         'school'
}

module.exports = {
    NON_REGISTERED_USER,
    REGISTERED_USER,
    EXAMPLE_TASK_1
}
