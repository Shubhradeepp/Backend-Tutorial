require('dotenv').config()
const express = require('express')

const app = express()
//This line creates an Express application instance.
//express() is a function provided by the imported Express module that creates a new Express application. Assigning the return value (the application instance) to app allows you to interact with the application using its methods and properties.

const db = require('./db');

const port = process.env.PORT || 5000
const passport = require('./auth');



const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req.body


// Middleware Function
const logRequest =(req, res, next)=> {
  console.log (`[${new Date().toLocaleString()}] Request made to:${req.originalUrl}` ) ;
  next();}

app.use(logRequest);


app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local', {session: false})

//Root path:(/) , Endpoint 

// app.get('/', function (req, res) {
//   res.send('Responce World')
// })

// app.get('/idli',  (req, res)=> {
//   res.send('Responce World idli')
// })

app.get('/curry',(req, res) => {
  var curry = {
    name: 'Chicken',
    Quant: 'Half',
    gravy: true,
    piece: 3
  }
  res.send(curry)
})


// Import the router
const personRoutes = require( './routes/personRoutes' ) ;

// Use the routes
app.use( '/person' , personRoutes);
//app.use( '/person',localAuthMiddleware , personRoutes);
//http://localhost:2000/person/Manager?username=imocto&password=1234

db()
.then(()=>{
    app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
})
.catch((err)=>{
console.log("Mongo dB Connection Failed !!" , err);
})









