const express = require("express");

const mongo = require("../shared/mongo");

// importing jwt to genetrate token
const jwt = require("jsonwebtoken");

//importing for password encrption
const bcrypt = require("bcrypt");

// importing for validating the registering data
//schema for register and login
const schema = require("../shared/schema");

// schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

const service = {
  async emailCheck(req, res) {
    const data = req.body;
    console.log(data);
    try {
      //initializig the schema
      const { error } = schema.login.validate(data, options);
      if (error)
        return res.status(400).send({ error: error.details[0].message });

      //check for email
      const user = await service.findEmail(data.email);
      if (!user)
        return res.status(400).send({ error: "User email is incorrect" });

    //Generating token and sending token as response
    const token = jwt.sign({userid : user._id,email : user.email}, process.env.TOKEN_SECRET, {expiresIn:"8h"});
        emailSending(token);
      
      const nodemailer = require("nodemailer");

      // async..await is not allowed in global scope, must use a wrapper
      async function emailSending(token) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: 'fitnesstracker123456@gmail.com', // generated user
            pass: 'sandeep222', // generated password
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Fitness tracker 👻" <fitnesstracker123456@gmail.com>', // sender address
          to: data.email, // list of receivers
          subject: "Hello ✔ fitness tracker verification link", // Subject line
          text: "Please click on the button to change the password", // plain text body
          html: `<b><a href=https://fitness-tracker-node-123.herokuapp.com/forgotPassword/${token}>Change password</a></b>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }

      emailSending().catch(console.error);
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Internal server error" });
    }
  },

  async register(req, res) {
    const data = req.body;
    try {
      //initializig the schema
      const { error } = schema.register.validate(data, options);
      if (error)
        return res.status(400).send({ error: error.details[0].message });

      // checking for email existance
      const user = await service.findEmail(data.email);
      if (user) return res.status(400).send({ error: "User already exists" });

      //Password encrption
      const salt = await bcrypt.genSalt(5);
      data.password = await bcrypt.hash(data.password, salt);

      await mongo.db.collection("users").insert(data);

      res.send("Account created");
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Internal server error" });
    }
  },

  findEmail(mail) {
    console.log(mail);
    return mongo.db.collection("users").findOne({ email: mail });
  },
};

module.exports = service;