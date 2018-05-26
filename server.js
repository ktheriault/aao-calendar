require("babel-polyfill");
require("es6-object-assign").polyfill();

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/build/'));
app.use('/src/assets', express.static(__dirname + '/src/assets/'));


app.listen(process.env.PORT || 8080);