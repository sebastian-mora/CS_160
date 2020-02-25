const express = require('express');
const router = express.Router();

router.get('/:uid', function(req, res) {
    res.send({
            'date_created': '2020-02-24 15:16:30',
            'date_due':     '2020-02-25 15:16:30',
            'title':        'my dummy task title',
            'description':  'my dummy description',
            'tags':     [],
            'comments': [],
            'subtasks': []
    });
});

router.use(express.json());
router.post('/', function(req, res) {
    console.log(request.body);
    response.send(request.body);
});

module.exports = router;
