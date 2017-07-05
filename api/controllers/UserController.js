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
var todas=['"FPS"','"RPG"','"MMO"','"RTS"'];
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
var mensaje="Fallaste";
var pregunta;
//funcion para la vista de perfil
function perfil (req,res){
	return res.status(200).view('perfil',{
		title: "Usuarios",
		user: user1,
		categoria: todas.join(),
		jg: jg,
		victoria: victoria,
		dificultad: dificultad,
		layout: 'layout',
	});
}
function game (req,res){
	return	res.status(200).view('juego',{
		title: "Preguntas",
		question: pregunta,
		estado: estado,
		puntaje: puntaje,
		elotro: elotro,
		mensaje: mensaje,
		layout: 'layout',
	});
}
//Iniciar sesión
function login (req, res) {

    passport.authenticate('local', function(err, user, info) {
        if ((err) || (!user)) {
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
			user1=user;
            if (err) res.send(err);
				return perfil(req,res);
        });
    })(req, res);
}

function logout (req, res) {
    req.logout();
    res.redirect('/login');
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
		return perfil(req,res);
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
			   game(req,res);
			})
			.catch((err) =>{
				res.status(500).send(err);
			})
	});
}
//Checa si la respuesta del usuario es correcta o no
function juegocompu (req, res){
	if(juego<=5){
		if(req.body.opcion){
			if(req.body.opcion == pregunta.correcta){
				mensaje="Bien hecho";
				puntaje=puntaje+50;
			}
			else{
				mensaje="Fallaste";
			}
		}
		else
			mensaje="Fallaste";
		if(dificultad=="Fácil"){
			if(Math.floor(Math.random()* 4)+1 == 2)
				elotro=elotro+50;
		}
		else{
			if(dificultad=="Intermedio"){
				if((Math.floor(Math.random()* 4)+1) == 2 || (Math.floor(Math.random()* 4)+1) ==3)
					elotro=elotro+50;
			}
			else
				if(Math.floor(Math.random()* 4)+1 != 2)
					elotro=elotro+50;
		}
		estado=1;
		game(req,res);
	}
	else{
		jg=1;
		if(puntaje > elotro)
			victoria="ganaste";
		else
			victoria="perdiste";
		Game.create({
			usuario: user1.id,
			estado: victoria,
			puntaje: puntaje,
			oponente: "CPU",
			bando: user1.bando,
			}).exec((err,user) => {
		if(err){
			console.log(err);
			return res.status(500).send('Error');
		}
		return perfil(req,res);
	});
		puntaje=0;
		elotro=0;
		juego=0;
	}
}
//Obtiene el avance del usuario
function puntos(req,res){
	return Game.find({"usuario": user1.id, "oponente": "CPU"})
	.then((foundGame) => {
		let pt=0;
		let gn=0;
		let wr=0;
		let mejor=0;
		foundGame.forEach(function(element) {
			if(element.estado=="ganaste"){
				if(mejor<element.puntaje){
					mejor=element.puntaje;
				}
				pt=pt+parseInt(element.puntaje);
				gn++;
			}
			else
				wr++;
		});
		res.status(200).view('puntajes',{
			title: "Puntajes",
			total: gn+wr,
			ganados: gn,
			puntaje: pt,
			mejor: mejor,
			perdidos: wr,
			layout: 'layout',
		});
	})
	.catch((err) =>{
		res.status(500).send("algo ocurrio");
	})
}
//Permite al usuario escoger las categorias para jugar
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
	return perfil(req,res);
}
//Escoger dificultad
function cambio (req,res){
	dificultad=req.body.dificultad;
	return perfil(req,res);
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
	puntos,
	perfil,
	cambio,
	juegocompu,
	logout,
	categoria,
};
