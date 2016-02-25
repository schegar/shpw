var express = require("express");
var db = require("./db.js");
var _ = require("underscore");
var bodyParser = require("body-parser");
var middleware = require("./middleware.js")(db);
var cryptojs = require("crypto-js");
var path = require("path");
var fs = require("fs");
var dir = './data';
var server;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "site")));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World')
})

// GET /accounts?n=facebook&u=test@test.com
app.get("/accounts", middleware.requireAuthentication, function(req, res){
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty("n") && query.n.length > 0) {
		where.name = {
			$like: "%" + query.n + "%"
		};
	}

	if (query.hasOwnProperty("u") && query.u.length > 0) {
		where.username = {
			$like: "%" + query.u + "%"
		};
	}

	req.user.getAccounts({where: where}).then(function (accounts) {
		var decryptedAccounts = [];

		accounts.forEach(function (account) {
			decryptedAccounts.push(account.decryptPassword());
		});	

		res.send(decryptedAccounts);
	}, function (e) {
		res.status(500).send();
	});	
});

// GET /accounts/:id
app.get("/accounts/:id", middleware.requireAuthentication, function (req, res) {
	var accountId = parseInt(req.params.id);

	db.account.findOne({
		where: {
			id: accountId,
			userId: req.user.get("id")
		}
	}).then(function (account) {
		if (!!account) {
			res.json(account.decryptPassword());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});
});


// POST /accounts
app.post("/accounts", middleware.requireAuthentication, function (req, res) {
	var body = _.pick(req.body, "name", "username", "password", "comment");

	db.account.create(body).then(function (account) {		
		req.user.addAccount(account).then(function () {
			return account.reload();
		}).then(function function_name(account) {
			res.json(account.toJSON());	
		})
	}, function (e) {
		console.log(e);
		res.status(400).json(e);
	});
});

// DELETE /accounts/:id
app.delete("/accounts/:id", middleware.requireAuthentication, function (req, res) {
	var accountId = parseInt(req.params.id);

	db.account.destroy({
		where: {
			id: accountId,
			userId: req.user.get("id")
		}
	}).then(function (rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: "No account with id"
			});
		} else {
			res.status(204).send();
		}
	}, function () {
		res.status(500).send();
	})
});

// PUT /accounts/:id
app.put("/accounts/:id", middleware.requireAuthentication, function (req, res) {
	var accountId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, "name", "username", "password", "comment");
	var attributes = {};

	if (body.hasOwnProperty("name")) {
		attributes.name = body.name;
	};

	if (body.hasOwnProperty("username")) {
		attributes.username = body.username;
	};

	if (body.hasOwnProperty("password")) {
		attributes.password = body.password;
	};

	if (body.hasOwnProperty("comment")) {
		attributes.comment = body.comment;
	};

	db.account.findOne({
		where: {
			id: accountId,
			userId: req.user.get("id")
		}
	}).then(function (account) {
		if (account) {
			account.update(attributes).then(function (account) {
				res.json(account.toJSON());
			}, function (e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	});

});

//POST /users
app.post("/users", function (req, res) {
	var body = _.pick(req.body, "email", "password");

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

});


db.sequelize.sync().then(function () {
	server = app.listen(PORT, function() {
		console.log("Express listening on port " + PORT + " !");
	});
});