var cryptojs = require("crypto-js");
var bcrypt = require("bcryptjs");
var _ = require("underscore");
var color = require("colors");

module.exports = function (sequelize, DataTypes) {
	return sequelize.define("account", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},		
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			},
			set: function (value) {
				var salt = bcrypt.genSaltSync(10);
				//console.log("Salt: "+salt.green);
				var decrypted =	cryptojs.AES.encrypt(value, salt).toString(); 	
				this.setDataValue("salt", salt);
				this.setDataValue("password", decrypted);
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		comment: {
			type: DataTypes.TEXT,
			validate: {
				len: [0, 500]
			},
			defaultValue: ""
		}
	}, {
		instanceMethods: {
			decryptPassword: function () {				
				var decryptedAccount = _.pick(this, "id", "name", "username", "password", "comment");
				//console.log("Salt: "+this.salt);
				var bytes = cryptojs.AES.decrypt(this.password, this.salt);
				decryptedAccount.password = bytes.toString(cryptojs.enc.Utf8);
				console.log(decryptedAccount);
				return decryptedAccount;
			}
		}
	});
}