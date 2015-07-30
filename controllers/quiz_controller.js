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
    //si viene en el query search contruimos where like
    if (req.query.search) {
      search = '%'+search.trim().replace(/ /g , "%")+'%';
      models.Quiz.findAll({where: ["pregunta like ?", search], order:'tema ASC, pregunta ASC'}).then( function (quizes) {
          res.render('quizes/index', {quizes:quizes,errors: []});
      }).catch(function(error) {next(error);});
    }else{
      models.Quiz.findAll({order:'tema ASC, pregunta ASC'}).then( function (quizes) {
          res.render('quizes/index', {quizes:quizes,errors: []});
      }).catch(function(error) {next(error);});
    }
}

//GET /quizes/:quizID
exports.show = function (req,res) {
    res.render('quizes/show',{quiz: req.quiz,errors: []});
};

//GET /quizes/answer
exports.answer = function (req,res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    }
    res.render ('quizes/answer', {respuesta: resultado, quiz: req.quiz, errors: []});
};

//GET /quizes/new
exports.new= function (req,res) {
    var quiz = models.Quiz.build(
        {tema: 'tema', pregunta: 'Pregunta', respuesta:'Respuesta'}
    );
    res.render ('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  var errors = quiz.validate();
  if (errors) {
    var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
    for (var prop in errors) errores[i++]={message: errors[prop]};
    res.render('quizes/new', {quiz: quiz, errors: errores});
  } else {
    //guarda en DB los campos pregunta y respuesta de quiz
    quiz.save({
      fields: ["tema", "pregunta", "respuesta"]
    }).then(function() {
      res.redirect('/quizes');
    });
  }
};

//GET /quizes/:id/edit
exports.edit = function (req, res){
  var quiz = req.quiz;

  res.render ('quizes/edit', {quiz: quiz, errors:[]});
};

//DELETE /quizes/:id

exports.destroy = function (req, res ){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

//UPDATE //quizes/:id
exports.update = function (req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  var errors = req.quiz.validate()

  if (errors) {
    var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
    for (var prop in errors) errores[i++]={message: errors[prop]};
    res.render('quizes/edit', {quiz: req.quiz, errors: errores});
  } else {
    //guarda en DB los campos pregunta y respuesta de quiz
    req.quiz.save({
      fields: ["tema", "pregunta", "respuesta"]
    }).then(function() {
      res.redirect('/quizes');
    });
  };



}
