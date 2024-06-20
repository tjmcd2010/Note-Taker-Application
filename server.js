const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const api = require('./routes/index.js');
// Middleware for parsing JSON and urlencoded form data
app.use(express.static('public'));
app.use(express.json());

