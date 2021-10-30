//importing express
const express = require("express");
const app = express();
bodyParser = require('body-parser'),

//importing environmental configuration
require("dotenv").config();

//cors
const cors = require("cors");

//importing JWT to check token
const jwt = require("jsonwebtoken");

//importing Routes
const postRoute = require("./routes/exercisesRoute");
const userRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const forgotPasswordRoute = require("./routes/forgotPasswordRoute")

//importing mongo
const mongo = require("./shared/mongo");

async function AppServer() {
  try {
    //connecting to mongo
    await mongo.connect();

    //cors
    app.use(cors());

    //Middelwares
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
    app.use(express.json());

//     app.use((req, res, next) => {
//       console.log("Allowed");
//       next();
//     });

    //Routes
    app.use("/forgotPassword", forgotPasswordRoute);
    app.use("/auth", authRoute);

    //Checking token
       app.use((req, res, next) => {
      const header = req.headers["access-token"];
         console.log(header)
      try {
        if (typeof header !== "undefined") {
          console.log("123");
          const bearer = header.split(" ");
          const token = bearer[1];
          console.log(bearer);
          console.log("yes entered")
          const userid = jwt.verify(token, process.env.TOKEN_SECRET);
          console.log("verifoed")
          console.log(userid);
          return next();
        }
      } catch (error) {
        console.log(error);
        res.status(401).send("invalid token");
      }

      res.send("token is missing");
    });

    app.use("/exercises", postRoute);
    app.use("/users", userRoute);

    //Starting App
    app.listen(process.env.PORT, () => {
      console.log("server app is running...");
    });
  } catch (err) {
    console.log(err);
    process.exit();
  }
}
AppServer();
