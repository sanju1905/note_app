require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require("method-override");
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const port = 5000 || process.env.PORT;
// After the user authentication
app.use(session(
    {
        secret:"Sanjay",// A magical secret key to protect the sessions
        resave:false, // Don't save sessions if nothing has changed
        saveUninitialized:true,// Create a new session for each visitor
        //Use the enchanted MongoStore
        store:MongoStore.create({
            mongoUrl:process.env.MONGODB_URI
        }),
       // cookie:{
           // maxAge:new Date(Date.now()+(3600000))
            //Date.now() - 30 *24 *60 *1000
        //}
    }
))
// Authentication
app.use(passport.initialize());
app.use(passport.session());


//use to pass the submit data to page to p-age
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride("_method"));

//Connect database
connectDB();
//static files
app.use(express.static('public'));


//templating engine
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine','ejs');
//Routes
app.use('/',require('./server/routes/auth'));
app.use('/',require('./server/routes/index'));
app.use('/',require('./server/routes/dashboard'));

//Handle 404
app.get('*',(req,res)=>
{
    // res.status(404).send("404 Page not Found.");
    res.status(404).render('404');
})

app.listen(port,()=>
{
 console.log(`App listenting on port ${port}`);   
}
)

