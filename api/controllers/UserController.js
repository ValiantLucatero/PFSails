/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const passport = require('passport');
    
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
			}).exec((err,user) => {
		if(err){
			return res.status(500).send('Error');
		}
		return res.status(200).send('resgistrado');
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
