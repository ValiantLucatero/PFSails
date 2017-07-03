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
					layout: 'layout',
		});
	});
}
//Imprime una pregunta al azar
function readQuestions (req,res){
	Question.count().exec(function countCB(error, found) {
		   return Question.find().skip(Math.floor(Math.random()*(((found)-1)-1)+1)).limit(1)
		   .then((foundQuestion) => {
			   console.log(foundQuestion);
				res.status(200).render('juego',{
					title: "Preguntas",
					users: foundQuestion,
					layout: 'layout',
				});
			})
			.catch((err) =>{
				res.status(500).send(err);
			})
	   });
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
	logout,
	categoria,
};
