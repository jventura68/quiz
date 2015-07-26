var express = require('express');
var models = require ('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if (quiz) {
        req.quiz = quiz;
        next();
      }else {
        next (new Error ('No existe quizId='+quizId));
      }
    }
  ).catch(function(error) {next(error);});
};

//GET quizes
exports.index = function (req,res) {
    var search = req.query.search;
    var where;
    //si viene en el query search contruimos where like
    if (req.query.search) {
      search = '%'+search.trim().replace(/ /g , "%")+'%';
      where = {where: {pregunta:{like:search}}};
    }
    models.Quiz.findAll(where).then( function (quizes) {
        res.render('quizes/index', {quizes:quizes});
    }).catch(function(error) {next(error);});
}

//GET /quizes/:quizID
exports.show = function (req,res) {
    res.render('quizes/show',{quiz: req.quiz});
};

//GET /quizes/answer
exports.answer = function (req,res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    }
    res.render ('quizes/answer', {respuesta: resultado, quiz: req.quiz});
};
