/**
 * User.js
 *
 * @description :: Implementacion de un modelo de usuario
 */
const bcrypt=require('bcrypt');
module.exports = {
  attributes: {
	 nombre:{
		type:'string',
    alpha: true,
    unique: true,
		required: true
	 },
	 email: {
    type: 'email',
    required: true,
    unique: true
   },
   password: {
    type: 'string',
    required: true
   },
		bando: {
		type:'string',
		required: true,
		},
  },
  beforeCreate:(values,cb) => {
	return bcrypt.hash(values.password, 18, (err,hash)=>{
		if(err){
			return cb(err);
		}
		values.password=hash;
		return cb(null,values);
	});
  },
};
