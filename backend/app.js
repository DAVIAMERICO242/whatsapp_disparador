const app = require('express')()
const bodyParser = require('body-parser');
const session = require('express-session');
const {router} = require('./routes')
const cors = require('cors'); // Import the CORS middleware
var cookies = require("cookie-parser");
require('dotenv').config();

app.use(cookies());

app.use(cors({
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
    credentials: true
  }));



app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',router)

app.listen(3050,()=>{console.log('escutando porta 3050')})