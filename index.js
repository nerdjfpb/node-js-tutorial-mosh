const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const logger = require('./logger');
const helmet = require('helmet');
const starterDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

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

const courses = [
	{id: 1, name: 'course1'},
	{id: 2, name: 'course2'},
	{id: 3, name: 'course3'},
];


app.get('/', (req, res) =>{
	res.render('index', { 
		title: 'My Express App', 
		heading1: 'Hello', 
		passage1: 'Testing the passsge, no idea how it will go' 
	});
});


app.get('/api/courses', (req, res) =>{
	res.send(courses);
});

app.get('/api/courses/:id', (req,res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) res.status(400).send('The Course with the given Id was not found');
	res.send(course);
});

app.post('/api/courses', (req,res) => {

	const { error } = validateCourse(req.body);	
	if(error) {
		res.status(400).send(error.details[0].message);
		return;
	}

	const course = {
		id: courses.length +1,
		name: req.body.name
	};
	courses.push(course);
	res.send(course);

});


app.put('/api/courses/:id',(req,res) => {

	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(400).send('The Course with the given Id was not found');

	const { error } = validateCourse(req.body);	
	if(error) {
		res.status(400).send(error.details[0].message);
		return;
	}
	else{
		course.name = req.body.name;
		res.send(course);
	}

});

app.delete('/api/courses/:id', (req,res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(400).send('The Course with the given Id was not found');
		
	const index = courses.indexOf(course);
	courses.splice(index, 1);

	res.send(course);
});



function validateCourse(course){
	
	const schema = {
		name : Joi.string().min(3).required()
	};

	return Joi.validate(course, schema);
}




//Port
const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`listening on port ${port}`));
