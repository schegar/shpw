var Sequelize = require("sequelize");

var sequelize = new Sequelize(undefined, undefined, undefined,  {
	"dialect": "sqlite",
	"storage": __dirname + "/data/database.sqlite"
});

var db = {};

db.user = sequelize.import(__dirname + "/models/user.js");
db.token = sequelize.import(__dirname + "/models/token.js");
db.account = sequelize.import(__dirname + "/models/account.js");

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.account.belongsTo(db.user);
db.user.hasMany(db.account);

module.exports = db;