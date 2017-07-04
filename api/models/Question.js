/**
 * Question.js
 *
 * @description :: Implementacion de un modelo para las preguntas
 */
module.exports = {
  attributes: {
	pregunta:{
		type:'string',
		required: true,
	},
	categoria:{
		type:'string',
		required: true,
	},
	opcion1:{
		type:'string',
		required: true,
	},
	opcion2:{
		type:'string',
		required: true,
	},
	opcion3:{
		type:'string',
		required: true,
	},
	opcion4:{
		type:'string',
		required: true,
	},
	correcta:{
		type:'string',
		required: true,
	},
  }
};