var express = require('express');

//MW de autorizaci�n de accesos HTTP restringidos
exports.loginRequired = function (req,res,next){
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

//GET /login   -- formulario login
exports.new= function (req,res) {
	var errors = req.session.errors || {};
	req.session.errors = {};
    res.render ('sessions/new', {errors: errors});
};

//POST /login   -- crear la sesion
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./users_controller');
	userController.autenticar(login, password, function(error, user) {
		if (error) { //devolvemos mensajes de error
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;
		}
		// Crear req.session.user y guardar id y username
		// Si existe req.session.user hay session creada
		req.session.user = {id:user.id, username:user.username};
		console.log('req.session'+req.session);
		if (req.session.redir){
			res.redirect (req.session.redir.toString()); //redir path anterior a login
		}else{
			res.redirect ('/');
		}
	});
};

//DELETE /logout -- Destruir sesion
exports.destroy = function (req,res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString()); //redir anterior a login
};
