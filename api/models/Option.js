/**
 * Option.js
 *
 * @description :: Implementacion de un modelo para las opciones
 */
module.exports = {
  attributes: {
	opcion:{
		type:'string',
		required: true,
	},
	tipo:{
		type:'string',
		required: true,
	},
  }
};