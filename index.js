const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const helmet = require('helmet');
const starterDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const courses = require('./routes/courses');

//doesn't require to call the pug/jade, just adding this line works
app.set('view engine', 'pug');
// this will initate where I'll hold the files- optional setting
app.set('views', './views');

//debuging
//need to change the enviroment variable to set DEBUG=app:startup;
// set DEBUG=app:* ; it will set all the variables
starterDebugger('application Name: ' + config.get('name'));
//configuration
console.log('application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));

console.log(`NODE_ENV: ${process.env.NODE_ENV}`); //undefined
console.log(`app: ${app.get('env')}`);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(logger); 

app.use('/api/courses', courses);

app.get('/', (req, res) =>{
	res.render('index', { 
		title: 'My Express App', 
		heading1: 'Hello', 
		passage1: 'Testing the passsge, no idea how it will go' 
	});
});





//Port
const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`listening on port ${port}`));
