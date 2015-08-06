var express = require('express');
var models = require ('../models/models.js');

//Autoload :id de comentarios
exports.load = function (req, res, next, commentId) {
	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	}).then(function(comment) {
		if (comment) {
			req.comment = comment;
			console.log ('autoload '+comment.texto + 'publicado' + comment.publicado)
			next();
		} else {
			next (new Error('No existe commentId='+commentId))
		}
	}).catch(function(error){next(error)});
}
//GET /quizes/:quizId/comments/new
exports.new= function (req,res) {
    res.render ('comments/new', {quizId: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comments/
exports.create = function(req, res) {
  var comment = models.Comment.build({
    texto:req.body.comment.texto,
    QuizId: req.params.quizId});
  var errors = comment.validate();
  if (errors) {
    var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
    for (var prop in errors) errores[i++]={message: errors[prop]};
    res.render('comment/new', {quiz: req.params.quizId, errors: errores});
  } else {
    //guarda en DB los campos pregunta y respuesta de quiz
    comment.save().then(function() {
      res.redirect('/quizes/'+req.params.quizId); //pregunta y comentarios
    }).catch(function(error){next(error)});
  }
};

//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function (req, res){
	for (var prop in req.comment) {
		console.log ('propiedad de comment '+prop);
	}
	req.comment.publicado = true;

	req.comment.save ( {fields:["publicado"]})
		.then (function() {res.redirect('/quizes/'+req.params.quizId);})
		.catch (function (error){next(error)});
};
