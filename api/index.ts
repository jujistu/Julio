import { Request, Response } from 'express';

export {};

//Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const joi = require('joi');

require('dotenv').config();
require('./auth');

//models imports
const User = require('./models/users');
const Order = require('./models/order');

//joi validation schema
const schema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

//Initialization
const app = express();

const port: number = 8000;

const connectionUrl = process.env.connection_Url as string;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configure database
mongoose
  .connect(connectionUrl)
  .then(() => {
    console.log('connected to mongo database');
  })
  .catch((err: unknown) => {
    console.log('Error connecting to database', err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//function to send verification email to the user
const sendVerificationEmail = async (email: string, verification: string) => {
  //create a nodemailer transport

  const transporter = nodeMailer.createTransport({
    //configure email service
    service: 'gmail',
    auth: {
      user: 'obiorapaschalugwu@gmail.com',
      pass: process.env.Google_App_Password as string,
    },
  });

  //compose the email message
  const mailOptions = {
    from: 'Julio.com',
    to: email,
    subject: 'Email Verification',
    text: `Please click the following link to verify your email : http://localhost:8000/verify/${verification}`,
  };

  //send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('error sending verification email', error);
  }
};

//endpoint to register in the app
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    //validate the data
    const { error } = schema.validate({ name, email, password });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    //check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already registered' });
    }

    //hash password for security
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new User
    const newUser = new User({ name, email, password: hashedPassword });

    //generate and store verification token
    newUser.verificationToken = crypto.randomBytes(20).toString('hex');

    //save the user
    await newUser.save();

    if (newUser) {
      res.status(200).json({
        success: true,
        message: 'User registered Successfully',
      });
    }

    //send verification email
    await sendVerificationEmail(newUser.email, newUser.verificationToken);
  } catch (error) {
    console.log('Error registering User', error);
    res.status(500).json({ success: false, message: 'Registration Failed' });
  }
});

//endpoint to verify email
app.get('/verify/:token', async (res: Response, req: Request) => {
  try {
    const token = req.params.token;

    //find the user with verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid verification token' });
    }

    //mark user as verified
    user.verified = true;

    user.verificationToken = undefined;

    //save updated user
    await user.save();

    res
      .status(200)
      .json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Email Verification failed' });
  }
});

// app.get(
//   '/auth/google',
//   passport.authenticate('google', { scope: ['profile'] })
// );

// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function (req: Request, res: any) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   }
// );
