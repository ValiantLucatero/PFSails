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
	opcion:{
		collection:'option',
		via:'id',
	},
  }
};