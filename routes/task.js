const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    res.send("requested task with no id");
});

// curl -v http://127.0.0.1:3000/task/
router.get('/:uid', function(req, res) {
    console.log("requested task with uid=" + req.params.uid);

    res.send({
            'uid': '',
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
