var express = require("express");
var db = require("./db.js");
var _ = require("underscore");
var bodyParser = require("body-parser");
var middleware = require("./middleware.js")(db);

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get("/passwords", function (req, res) {
	
})

//POST /users
app.post("/users", function (req, res) {
	var body = _.pick(req.body, "email", "password");
	console.log(req.body);

	db.user.create(body).then(function (user) {		
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
})

// POST /users/login
app.post("/users/login", function (req, res) {
	var body = _.pick(req.body, "email", "password");
	var userInstance;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		userInstace = user;
		return db.token.create({
			token: token
		})
	}).then(function (tokenInstance) {
		res.header("Auth", tokenInstance.get("token")).json(userInstace.toPublicJSON());
	}).catch(function (e) {
		console.log(e);
		res.status(401).send();
	});

})

db.sequelize.sync({force: true}).then(function () {
	app.listen(PORT, function() {
		console.log("Express listening on port " + PORT + " !");
	});
});