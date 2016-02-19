var express = require("express");
var db = require("./db.js");
var _ = require("underscore");
var bodyParser = require("body-parser");
var middleware = require("./middleware.js")(db);
var cryptojs = require("crypto-js");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World')
})

// GET /accounts?completed=true?q=house
app.get("/accounts", middleware.requireAuthentication, function(req, res){
	var query = req.query;
	/*var where = {};

	//where.id = req.user.get("id");

	if (query.hasOwnProperty("completed") && query.completed === "true") {
		where.completed = true;
	} else if (query.hasOwnProperty("completed") && query.completed === "false") {
		where.completed = false;
	}
	if (query.hasOwnProperty("q") && query.q.length > 0) {
		where.description = {
			$like: "%" + query.q + "%"
		};
	}*/

	req.user.getAccounts().then(function (accounts) {

		var decryptedAccounts = [];

		accounts.forEach(function (account) {
			var decryptedAccount = _.pick(account, "name", "username", "password");
			var bytes = cryptojs.AES.decrypt(account.password, account.username);
			decryptedAccount.password = bytes.toString(cryptojs.enc.Utf8);
			decryptedAccounts.push(decryptedAccount);
		});	
		res.send(decryptedAccounts);
	}, function (e) {
		res.status(500).send();
	});	
});

// POST /accounts
app.post("/accounts", middleware.requireAuthentication, function (req, res) {
	var body = _.pick(req.body, "name", "username", "password");

	db.account.create(body).then(function (account) {		
		req.user.addAccount(account).then(function () {
			return account.reload();
		}).then(function function_name(account) {
			res.json(account.toJSON());	
		})
	}, function (e) {
		res.status(400).json(e);
	});
});

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