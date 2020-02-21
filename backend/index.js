const keys = require('./keys');

const express = require('express');
const app = express();

//mongodb
const mongoose = require('mongoose');

mongoose
	.connect(keys.url, {
		useNewUrlParser: true,
		user: keys.user,
		pass: keys.pwd,
	})
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.log(`Fail to connect to MongoDB: ${err}`));
