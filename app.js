var createError = require('http-errors');
var express = require('express');
var connectDB = require("./queries");

// First off, create a database connection
connectDB.createConnection(function (err, client) {
  if (err) return console.log(err);
  
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');
  var port = process.env.PORT || 3000;
  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  // app.use("/", require("./routes/get"));
  // app.use("/", require("./routes/post"));
  // app.use("/", require("./routes/patch"));
  // app.use("/", require("./routes/delete"));
  var app = express();

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", indexRouter);
  app.use("/users", usersRouter);
  

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  // Start the application
  app.listen(port, () => console.log(`Listening on port ${port}`));

});
