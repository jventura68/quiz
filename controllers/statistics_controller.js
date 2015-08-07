var express = require('express');
var models = require ('../models/models.js');
var statistics= {
		numPreguntas:0,
		numPreguntasConComments:0,
		numPreguntasSinComments:0,
		numComments:0,
		mediaComments:0
};

//Autoload :id de comentarios
exports.count = function (req, res, next) {

	models.Quiz.count()
		.then (function (numPreguntas) { //numero de preguntas
				statistics.numPreguntas = numPreguntas;
				return models.Comment.count();
		}).then (function (numComments){
				statistics.numComments=numComments;
				statistics.mediaComments = numComments / statistics.numPreguntas;
				return models.Comment.count( { group : 'QuizId'});
		}).then (function (numPreguntasConComments){
				statistics.numPreguntasConComments=numPreguntasConComments;
				statistics.numPreguntasSinComments=statistics.numPreguntas-
																					 numPreguntasConComments;
		})
		.catch(function(error) {next(error);})
		.finally(function () { //siempre va al siguiente MW
    	next();
		});
};

exports.show = function (req,res,next){
		res.render ('quizes/statistics', {statistics: statistics, errors: []});
}
