/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const passport = require('passport');
//guarda los datos del usuario
var user1, pregunta, oponenteId, pendiente, pendienteId, bando; 
//checar categorias 
var todas=['"FPS"','"RPG"','"MMO"','"RTS"'];
var category=0; 
//verifica si la pregunta apenas se contesta o se califica 
var estado=0;
var juego=0;
var jg=0;
var dificultad="Intermedio";
var oponente="CPU";
var victoria="falta las respuestas del otro";
//puntajes
var puntaje=0;
var elotro=0;
//verificacion de la pregunta
var mensaje="Fallaste";
//funcion para la vista de perfil
function jugador1 (req,res,info,m){
	Game.create({
		usuario: info.usuario,
		estado: m,
		puntaje: info.puntaje1,
		oponente: user1.nombre,
		bando: bando,
	}).exec((err,user) => {
		if(err){
			console.log(err);
			return res.status(500).send('Error');
		}
	})
}
function jugador2 (req,res,m){
	Game.create({
		usuario: user1.id,
		estado: m,
		puntaje: puntaje,
		oponente: oponente,
		bando: user1.bando,
	}).exec((err,user) => {
		if(err){
			console.log(err);
			return res.status(500).send('Error');
		}
	})
}
function perfil (req,res){
		puntaje=0;
		elotro=0;
		juego=0;
	return res.status(200).render('perfil',{
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
	return	res.status(200).render('juego',{
		title: "Preguntas",
		question: pregunta,
		estado: estado,
		puntaje: puntaje,
		elotro: elotro,
		oponente: oponente,
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
			   if(req.body.compu){
				   oponente="CPU";
			   }
			   else{
				   if(req.body.oponente){
						oponenteId=req.body.oponente;
						User.findOne({"id":req.body.oponente},{"nombre":1}).exec(function(err, items) {
								oponente=items.nombre;
						});
				   }
				   if(req.body.otrojuego && req.body.resp=="si"){
					   pendienteId=req.body.otrojuego;
						Partida.findOne({"id":req.body.otrojuego},{"usuario":1}).exec(function(err, items) {
							pendiente=items.usuario;
							User.findOne({"id":pendiente},{"nombre":1}).exec(function(err, items) {
								oponente="*"+items.nombre;
								bando=items.bando;
							});
						});
					}
			   }
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
		if(oponente=="CPU"){
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
		}
		estado=1;
		game(req,res);
	}
	else{
		jg=1;
		if(oponente=="CPU"){
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
				})
		}
		else{
			if(oponente.indexOf("*")!=-1){
				Partida.findOne({"id":pendienteId}).exec(function(err, info) {
					if(info.puntaje1>puntaje){
						jugador1(req,res,info,"ganaste");
						jugador2(req,res,"perdiste");
					}
					else{
						jugador2(req,res,"ganaste");
						jugador1(req,res,info,"perdiste");
					}
					Partida.destroy({"id":pendienteId}).exec(function(err) {});
				});
			}
			else{
				//victoria="Espera a tu oponente";
				Partida.create({
					usuario: user1.id,
					oponente: oponenteId,
					puntaje1: puntaje,
					puntaje2: 0,
					}).exec((err,user) => {
						if(err){
							console.log(err);
							return res.status(500).send('Error');
						}
					})
			}
		}
		return perfil(req,res);
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
		var game;
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
			var myQuery = Game.find();
			myQuery.where({"usuario": user1.id, "oponente":{$ne:"CPU"}});
			myQuery.exec(function callBack(err,results){
				game=results;
				res.status(200).render('puntajes',{
					title: "Puntajes",
					total: gn+wr,
					ganados: gn,
					puntaje: pt,
					mejor: mejor,
					perdidos: wr,
					games: game,
					layout: 'layout',
				});
			});
		});
	})
	.catch((err) =>{
		res.status(500).send("algo ocurrio");
	})
}
//Escoger oponente
function readUser(req,res){
	return User.find()
	.then((foundUsers) => {
		res.status(200).render('readUsers',{
			title: "Usuarios",
			users: foundUsers,
			esteNo: user1.id,
			layout: 'layout',
		});
	})
	.catch((err) =>{
		res.status(500).send("algo ocurrio");
	})
}
//Juegos pendientes
function pendiente(req,res){
	return Partida.find({"oponente":user1.id})
	.then((foundPartida) => {
		res.status(200).render('partida',{
			title: "Usuarios",
			games: foundPartida,
			layout: 'layout',
		});
	})
	.catch((err) =>{
		res.status(500).send(err);
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
	pendiente,
	readUser,
	juegocompu,
	logout,
	categoria,
};
