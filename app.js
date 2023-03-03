const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ej');
const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/stockDB", {useNewUrlParser: true});

const userSchema = {
  email: String,
  password: String,

}

const User = new mongoose.model("User", userSchema);

app.get("/login", function (req, res) {
  res.render("login");
})

app.get("/register", function (req, res) {
  res.render("register");
})

app.get("/home", function (req, res) {
  res.render("home");
})

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render("stock");
    }
  });
});


app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(req, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("stock");
        }
      }
    }
  });
});


const stockSchema = {
  name: String,
  ticker: String,
};

const Stock = new mongoose.model("Stock", stockSchema);

app.route("/stocks")

  .get((req, res) => {
    Stock.find(function(err, foundStocks) {
      if (!err) {
        res.send(foundStocks);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
  
    const newStock = new Stock({name: req.body.name, ticker: req.body.ticker});
  
    newStock.save(function(err) {
      if (!err) {
        res.send("Success");
      } else {
        res.send(err);
      }
    });
      
  })

  .delete((req, res) => {
    Stock.deleteMany(function(err) {
      if (!err) {
        res.send("Success");
      } else {
        res.send(err);
      }
    });
  });

app.route("/stocks/:stockName")

  .get((req, res) => {
    res.findOne({name: req.params.stockName}, function(err, foundStock) {
      if (foundStock) {
        res.send(foundStock);
      } else {
        res.send("No stocks found")
      }
    });
  })

  .put(function(req, res){

    Stock.updateOne(
      {name: req.params.stockName},
      {name: req.body.name, ticker: req.body.ticker},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected stock.");
        }
      }
    );
  })

  .patch((req, res) => {
    Stock.updateOne(
      {name: req.params.stockName},
      {$set: req.body},
      function(err) {
        if (!err) {
          res.send("Success")
        } else {
          res.send(eff);
        }
      }
    );
  })

  .delete((req, res) => {
    Stock.deleteOne(
      {name: req.params.stockName},
      function(err) {
        if (!err) {
          res.send("Success");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
