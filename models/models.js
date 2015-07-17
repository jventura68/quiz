var path=require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd,
                  { dialect:  dialect,
                    protocol: protocol,
                    port:     port,
                    host:     host,
                    storage:  storage, //solo SQLite (.env)
                    omitNull: true     //solo Postgres
                  }
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
