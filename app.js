var express    = require('express');
var path       = require('path');
var mysql      = require('mysql');
var bodyParser = require('body-parser');

const port = 3000;

var routes = require('./routes/index');
var users  = require('./routes/user');
var tasks  = require('./routes/tasks');
var login  = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/tasks?', tasks);
app.use('/tasks/:uid', tasks);
app.use('/login', login);

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;


});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port, () => console.log(`CS-160 app listening on port ${port}!`));
