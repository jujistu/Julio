//Imports

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import crypto from 'crypto';
import nodeMailer from 'nodemailer';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

//Initialization
const app = express();

const port: number = 8000;

const connectionUrl =
  'mongodb+srv://obiorapaschalugwu:Qwerty2580@cluster0.bm3irt9.mongodb.net/';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configure database
mongoose
  .connect(connectionUrl)
  .then(() => {
    console.log('connected to mongo database');
  })
  .catch((err) => {
    console.log('Error connecting to database', err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
