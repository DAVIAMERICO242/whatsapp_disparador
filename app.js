const app = require('express')()
const session = require('express-session');
const {router} = require('./routes')


app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true
}));

app.use('/',router)

app.listen(3050,()=>{console.log('escutando porta 3050')})