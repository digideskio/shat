// Generated by CoffeeScript 1.3.3
(function() {
  var app, env, everyauth, express, nunjucks, port, usersById;

  nunjucks = require("nunjucks");

  express = require("express");

  everyauth = require("everyauth");

  usersById = {};

  everyauth.everymodule.findUserById(function(id, callback) {
    return callback(null, usersById[id]);
  });

  everyauth.facebook.appId(process.env.FB_APP_ID).appSecret(process.env.FB_APP_SECRET).scope("email").fields("id,name,email,picture").findOrCreateUser(function(session, accessToken, accessTokenExtra, fbUserMetadata) {
    if (usersById[fbUserMetadata.id] !== void 0) {
      return usersById[fbUserMetadata.id];
    } else {
      return usersById[fbUserMetadata.id] = fbUserMetadata;
    }
  }).redirectPath('/');

  app = express();

  app.use(express.logger());

  app.use(express.bodyParser());

  app.use(express.cookieParser("foobie"));

  app.use(express.session());

  app.use(everyauth.middleware());

  env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));

  env.express(app);

  app.get("/", function(req, res, params) {
    if (req.user) {
      res.render("main.html");
      console.log("user is " + req.user);
    } else {
      res.render("fblogin.html");
    }
    return void 0;
  });

  port = process.env.PORT || 5000;

  app.listen(port, function() {
    console.log("Listening on port " + port);
    return void 0;
  });

}).call(this);
