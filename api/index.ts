import { NextFunction, Request, Response, response } from 'express';

//Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const joi = require('joi');

require('dotenv').config();

//Initialization
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = 8000;

const SecretKey = process.env.Paystack_SecretKey as string;

const connectionUrl = process.env.connection_Url as string;

//models imports
const User = require('./models/users');
const Order = require('./models/order');

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

///
///
//========joi validation schema==========
const RegSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const logSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

///
///=======SecretKey JWT========
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');

  return secretKey;
};

const secretKey = generateSecretKey();

////
////
//format price
const formattedPrice = (price: number) => {
  const initialPrice = price * 970;

  const formattedPrice = initialPrice.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return formattedPrice;
};

///
///===============function to send verification email to the user==============
const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  //create a nodemailer transport

  const transporter = nodemailer.createTransport({
    //configure email service
    service: 'gmail',
    auth: {
      user: 'obiorapaschalugwu@gmail.com',
      pass: process.env.Google_App_Password as string,
    },
  });

  //compose the email message
  const mailOptions = {
    from: 'Julio@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Please click the following link to verify your email : http://localhost:8000/verify/${verificationToken}`,
  };

  //send the email
  try {
    await transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
      } else {
        console.log('sent', info.response);
      }
    });
  } catch (error) {
    console.log('error sending verification email', error);
  }
};

///
///
//
///
///=====All endpoints======================
//
//========endpoint to register in the app========
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    //validate the data
    const { error } = RegSchema.validate({ name, email, password });

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

//
//
// ==============look into verification=============
//endpoint to verify email
app.get('/verify/:token', async (res: any, req: Request) => {
  const token = req.params.token as string;
  console.log(token);
  try {
    //find the user with verification token

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid verification token' });
    }

    if (user) {
      //mark user as verified
      user.verified = true;

      user.verificationToken = undefined;

      //save updated user
      await user.save();

      res
        .status(200)
        .json({ success: true, message: 'Email verified successfully' });
    }
  } catch (error) {
    console.log('error verify', error);
    res
      .status(500)
      .json({ success: false, message: 'Email Verification failed' });
  }
});

//
//
//endpoint to login User
app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //validate the data
    const { error } = logSchema.validate({ email, password });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    //check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    //check if the password is correct
    if ((await bcrypt.compare(password, user.password)) === false) {
      return res.status(402).json({ message: 'Invalid Password' });
    }

    //check if user is verified
    if (user.verified === false) {
      return res.status(403).json({ message: 'Verify your email' });
    }

    //generate auth token
    const token = jwt.sign({ userId: user._id }, secretKey);

    if (token) {
      return res.status(200).json({ token });
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Login Failed' });
  }
});

//
//
//
//=====endpoint to store a new address======
app.post('/addresses', async (req: Request, res: Response) => {
  try {
    const { userId, address } = req.body;

    // find the user by the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //add the new address to the user's addresses array
    user.addresses.push(address);

    //save updated user address in DB
    await user.save();

    res.status(200).json({ message: 'Address created Successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding address' });
  }
});

//
//
//=====endpoint to get all the addresses of a user
app.get('/addresses/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addresses = user.addresses;

    return res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the addresses' });
  }
});

///
///
///
//endpoint to store all the orders
app.post('/orders', async (req: Request, res: Response) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //create an array of product objects from the cart Items required in Orders schema
    const products = cartItems.map((item: any) => ({
      name: item?.title,
      quantity: item?.quantity,
      price: formattedPrice(item?.price),
      image: item?.image,
    }));

    //create a new Order
    const order = new Order({
      user: userId,
      products,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: 'Order created successfully!' });
  } catch (error) {
    console.log('error creating orders', error);
    res.status(500).json({ message: 'Error creating orders' });
  }
});

////
////
////
//get the user profile
app.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //send the user details
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the user profile' });
  }
});

////
////
////
//get order for a particular User
app.get('/orders/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    //getting orders and compiling
    const orders = await Order.find({ user: userId }).populate('user');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});
