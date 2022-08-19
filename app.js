const express = require(`express`);
const mongoose = require(`mongoose`);
const bodyParser = require("body-parser");
const app = express();
const db = mongoose.connect("mongodb://localhost/userAPI");
const userRouter = express.Router();
const port = process.env.PORT || 4000;
const user = require("./models/userModel.js");
const bcrypt = require("bcrypt")
const saltRounds = 2;
const { use } = require("bcrypt/promises");
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-w6lecynb.us.auth0.com/.well-known/jwks.json'
}),
audience: 'http://localhost:3000',
issuer: 'https://dev-w6lecynb.us.auth0.com/',
algorithms: ['RS256']
});

userRouter
  .route("/users")
  .post((req, res) => {
    const user = new user(req.body);
    bcrypt.hash(user, async function (err, hash){

    })
    user.save();
    return res.status(201).json(user);
  })
  .get((req, res) => {
    const query = {};
    user.find(query, (err, users) => {
      if (err) {
        return res.send(err);
      }
      return res.json(users);
    });
  });

userRouter
  .route("/users/:userId")
  .get((req, res) => {
    user.findById(req.params.userId, (err, user) => {
      if (err) {
        return res.send(err);
      }
      return res.json(user);
    });
  })

  .put((req, res) => {
    user.findById(req.params.userId, (err, user) => {
      if (err) {
        return res.send(err);
      }
      user.name = req.user.name;
      user.password = req.user.password;
      user.adminLevel = req.user.adminLevel;
      return res.json(user);
    });
  });

app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to my Nodemon API!");
});

app.listen(port, () => {
  console.log(`Running on port + ${port}`);
});



async function dbAuthorizer(name, password, adminLevel) {
  try{
    // get matching user from db
    const user = await user.findOne({where: {name: userName}})
    // if title is valid compare genres
    let isValid = ( user != null ) ? await bcrypt.compare(name, user.name) : false;
    callback(null, isValid)
  }catch(err){
    //if authorizer fails, show error
    console.log("Error: ", err)
    callback(null, false)
  }
}