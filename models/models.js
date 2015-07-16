var path=require('path');

//cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
                  { dialect: "sqlite", storage: "./data/quiz.sqlite"}
                );

//Importar la definicion de tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Exportar definición tabla Quiz
exports.Quiz = Quiz;

//Crear e inicializar tabla Quiz
sequelize.sync().success(function(){
  Quiz.count().success (function(count){
    if (count==0) {
      Quiz.create({pregunta: 'Capital de Italia',
                   respuesta: 'Roma'
                   })
      .success(function(){console.log('Base de datos inicializada')});
    };
  });
});
