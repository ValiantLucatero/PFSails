/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const passport = require('passport');
var user1;   
//Iniciar sesión
function login (req, res) {

    passport.authenticate('local', function(err, user, info) {
        if ((err) || (!user)) {
            return res.send({
                message: info.message,
                user: user
            });
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
//Crea preguntas con sus opciones creo que las opciones no las agrega
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
//Imprime todas las preguntas con sus opciones, esto aun no lo hace
function readQuestions (req,res){
	return Question.find()
	.then((foundQuestions) => {
		console.log(foundQuestions);
		res.status(200).send(questions);
	})
	.catch((err) =>{
		res.status(500).send("algo ocurrio");
	})
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
};
