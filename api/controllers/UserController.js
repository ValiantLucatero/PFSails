/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const passport = require('passport');
//guarda los datos del usuario
var user1; 
//checar categorias 
var todas=[];
var category=0; 
//verifica si la pregunta apenas se contesta o se califica 
var estado=0;
var juego=0;
var jg=0;
var dificultad="Intermedio";
var victoria;
//puntajes
var puntaje=0;
var elotro=0;
//verificacion de la pregunta
var mensaje="";
var pregunta;
//Iniciar sesión
function login (req, res) {

    passport.authenticate('local', function(err, user, info) {
        if ((err) || (!user)) {
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
			user1=user;
            if (err) res.send(err);
				return res.status(200).render('perfil',{
					title: "Usuarios",
					user: user,
					jg: jg,
					victoria: victoria,
					dificultad: dificultad,
					layout: 'layout',
				});
        });
    })(req, res);
}

function logout (req, res) {
    req.logout();
    res.redirect('/');
}
 //Crea nuevos usuarios
function createUser (req, res){
	User.create({
			nombre: req.body.nombre,
			email: req.body.email,
			password: req.body.password,
			bando: req.body.bando,
			}).exec((err,user) => {
		if(err){
			console.log(err);
			return res.status(500).send('Error');
		}
		return res.redirect('/login');
	});	
}
//Crea preguntas con sus opciones
function createQuestion (req, res){
	Question.create({
			pregunta: req.body.pregunta,
			categoria: req.body.categoria,
			opcion1: req.body.opcion1,
			opcion2: req.body.opcion2,
			opcion3: req.body.opcion3,
			opcion4: req.body.opcion4,
			correcta: req.body.correcta,
			}).exec((err,user) => {
		if(err){
			console.log(err);
			return res.status(500).send('Error');
		}
		return res.status(200).render('perfil',{
					title: "Usuarios",
					user: user1,
					jg: jg,
					victoria: victoria,
					dificultad:dificultad,
					layout: 'layout',
		});
	});
}
//Imprime una pregunta al azar
function readQuestions (req,res){
	Question.count().exec(function countCB(error, found) {
		   return Question.find().skip(Math.floor(Math.random()* found )).limit(1)
		   .then((foundQuestion) => {
			   pregunta=foundQuestion[0];
			   estado=0;
			   juego++;
				res.status(200).render('juego',{
					title: "Preguntas",
					question: foundQuestion[0],
					estado: estado,
					puntaje: puntaje,
					elotro: elotro,
					mensaje: mensaje,
					layout: 'layout',
				});
			})
			.catch((err) =>{
				res.status(500).send(err);
			})
	});
}
//checa si la respuesta del usuario es correcta o no
function juegocompu (req, res){
	if(juego<=5){
		if(req.body.opcion == pregunta.correcta){
			mensaje="Bien hecho";
			puntaje=puntaje+50;
		}
		else{
			mensaje="Fallaste";
		}
		if((Math.floor(Math.random()* 3)+1) == 2)
			elotro=elotro+50;
		estado=1;
		res.status(200).render('juego',{
			title: "Preguntas",
			question: pregunta,
			estado: estado,
			puntaje: puntaje,
			elotro: elotro,
			mensaje: mensaje,
			layout: 'layout',
		});
	}
	else{
		jg=1;
		if(puntaje > elotro)
			victoria="ganaste";
		else 
			victoria="perdiste";
		res.status(200).render('perfil',{
			title: "Usuarios",
			user: user1,
			jg: jg,
			dificultad:dificultad,
			victoria:victoria,
			layout: 'layout',
		});
		puntaje=0;
		elotro=0;
		juego=0;
	}
}
//Permite al usuario escoger las categorias para jugar, no agarra el isset
function categoria (req,res){
	if(req.body.FPS || req.body.RPG || req.body.MMO || req.body.RTS){
		todas.length=0;
		category=1;
		if(req.body.FPS)
			todas.push('"FPS"');
		if(req.body.RPG)
			todas.push('"RPG"');
		if(req.body.MMO)
			todas.push('"MMO"');
		if(req.body.RTS)
			todas.push('"RTS"');
	}
	else
		category=0;
	console.log(todas);
	console.log(category);
	return res.status(200).render('perfil',{
		title: "Usuarios",
		user: user1,
		jg: jg,
		dificultad: dificultad,
		victoria: victoria,
		layout: 'layout',
	});
}
function cambio (req,res){
	dificultad=req.body.dificultad;
	return res.status(200).render('perfil',{
		title: "Usuarios",
		user: user1,
		jg: jg,
		dificultad: dificultad,
		victoria: victoria,
		layout: 'layout',
	});
}
module.exports = {
	 _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },
	createUser,
	createQuestion,
	readQuestions,
	login,
	cambio,
	juegocompu,
	logout,
	categoria,
};
