var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require ('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var moment = require('moment');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinamicos:
app.use(function (req,res,next){
	//guardar path en session.redir para despues del login
	if (!req.path.match(/\/login|\/logout/)){
		req.session.redir=req.path;
	}
	//Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

//auto-logout, si la session está inactiva más de 10 seg. la destruye
app.use(function (req,res,next) {
	if (req.session.user){
			if (req.session.user.time){
				var startDate = moment(req.session.user.time);
				var endDate = moment(new Date());
				var secondsDiff = endDate.diff(startDate, 'seconds')
				console.log('user ' +req.session.user.username+ ' sesion activa durante ' + secondsDiff+ ' segundos')
				if (secondsDiff>60) {
					console.log ('user ' +req.session.user.username+ ' timeout de sesion')
					delete req.session.user;
				} else {
					req.session.user.time = new Date();
					console.log ('user '+ req.session.user.username+ " restaura sesion "+req.session.user.time)
				}
			} else {
				req.session.user.time = new Date();
				console.log ('user '+ req.session.user.username+ " inicia sesion "+req.session.user.time)
			}
	}
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
