const router = require('express').Router()
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {genQRCode,WppConnections, isWppConnected, WppDeleteConnection} = require('./whatsapp')
const secretKey = 'yJNIDJ8329D0'; // Change this to a secure random key
require('dotenv').config();

router.post('/delete_connection', async (req,res)=>{
  console.log('DELETE CONNECTION TRIGGERED')
  const token = req?.headers['token'];
  if(!token){
    console.log('TOKEN NAO ENCONTRADO')
    res.status(400).end()
    return
  }
  const {connection_name} = req.body;
  console.log('CONNECTION NAME IN DELETE')
  console.log(connection_name)
  const decoded = jwt.verify(token, secretKey);
  const user_name = decoded.username;
  try{
    const deletion_process = await WppDeleteConnection(connection_name, user_name)
    res.status(200).end()
  }catch(error){
    res.status(400).end()
    console.log(error)
    return
  }
})

// Create a connection to the database
router.get('/is_wpp_connected', async (req,res)=>{
  const token = req?.headers['token'];
  if(!token){
    console.log('TOKEN NAO ENCONTRADO')
    res.status(400).end()
    return
  }
  const {connection_name} = req.query
  console.log('NOME DA CONEXÃO')
  console.log(connection_name)
  if(!connection_name){
    res.status(400).end()
    return
  }
  const decoded = jwt.verify(token, secretKey);
  const user_name = decoded.username;
  try{
    const response = await isWppConnected(connection_name, user_name)
    console.log('STATUS DA CONEXÃO ENDPOINT')
    console.log(response)
    res.status(200).send(response)
  }catch(error){
    console.log(error)
    return
  }
  
})



router.get('/connections' , async (req,res)=>{
  const token = req?.headers['token'];
  if(!token){
    console.log('TOKEN NAO ENCONTRADOOOOO020')
    res.status(400).end()
    return
  }
  const decoded = jwt.verify(token, secretKey);
  const user_name = decoded.username;
  try{
        const connections = await WppConnections()
        if(connections){
            const user_connections = connections.filter((e,i)=>e.includes(user_name))
            const frontend_user_connections = user_connections.map((e,i)=>{
              const parts = e.split("_");
              const firstPart = parts[0]; // "admin"
              const secondPart = parts.slice(1).join("_"); // "davi_americo"
              return secondPart
            })
            console.log('CONEXÕES FRONTEND')
            console.log(frontend_user_connections)
            res.status(200).send(frontend_user_connections)
        }else{
            res.status(200).send('NENHUM CONEXÃO')
        }
     }catch(error){
      console.log(error)
      return
     }
})



router.post('/qrcode', async (req, res) => {
  const token = req?.headers['token'];
  if(!token){
    res.status(400).end()
    return
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const user_name = decoded.username;
    const { connection_name } = req.body;
    console.log(req.body.connection_name);

    const {statusCode,qr_base64} = await genQRCode(user_name, connection_name);
    res.status(statusCode).send(qr_base64); // Envie o status code de volta para o cliente
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(); // Se houver um erro, envie um status code 500
  }
});


router.get('/auth', (req, res) => {
    console.log('entrou')
    // Perform SQL query
    const connection = mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME
    });
    
    // Connect to the database
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return;
      }
      const query = 'SELECT * FROM users WHERE user = ? AND pass = ?';
      console.log('Connected to database!');
      var {user,pass} = req.query
      console.log(user)
      console.log(pass)
      if(!(user && pass)){
          res.status(404).send('UNAUTHORIZED')
          return;
      }
      connection.query(query, [user, pass], (error, results, fields) => {
        if (error) {
          res.status(500).end()//por logica de reiniciar o servidor
          return;
        }else{
          const userMatch = results.find(row => row.user===user && row.pass===pass);
          if(!userMatch){
              res.status(404).end()
              return;
          }
        }
        const token = jwt.sign({ username: user }, secretKey, { expiresIn: 60 * 60 * 24 * 7 })
        res.status(200).json({token})
        connection.end((err) => {
          if (err) {
            console.error('Error closing database connection:', err);
            return;
          }
          console.log('Connection to database closed.');
        });
      });
    });
  });

router.get('/private_route', (req,res)=>{
    console.log('erro ?')
    const token = req?.headers['token'];
    if(!token){
        res.status(404).send('NAO AUTORIZADO')
        return
    }else{
        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.status(403).end();
            console.log('rota privada autorizada')
            res.status(200).end()
        });
    }
})

router.post('/disparo', (req, res) => {
  console.log(req.headers);
  const token = req?.headers['token'];
  if (!token) {
      console.log('USUARIO DISPARO NAO AUTORIZADO');
      res.status(404).send('NAO AUTORIZADO');
      return
  } else {
      jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
              console.log('USUARIO DISPARO NAO AUTORIZADO (PROVAVEL TOKEN EXPIRADO)');
              return res.status(403).end();
          } else {
              var {username} = decoded;
              var {campaign_name} = req.body;
              var campaign_name = campaign_name.replace(/\s+/g, ' ').trim()
              var {connection_name} = req.body;
              var {unfilter_how_many_to_disparo} = req.body;
              var {campaign_to_exclude} = req.body;
              var {interval_between_disparo} = req.body;
              var {message} = req.body;
              var {image} = req.body;

              console.log('USUARIO AUTORIZADO PARA DISPARO');
              console.log(`Usuário que solicitou o disparo:${username}`)
              console.log(`Nome da campanha: ${campaign_name}}`);
              console.log(`Conexão escolhida: ${connection_name}`);
              console.log(`Número de contatos a serem disparados (sem filtrar campanha): ${unfilter_how_many_to_disparo}`);
              console.log(`Campanha excluída: ${campaign_to_exclude}`);
              console.log(`Intervalo entre cada disparo: ${interval_between_disparo}`);
              console.log(`Mensagem a ser disparada: ${message}`);
              console.log(`Imagem a ser disparada: ${image}`);

              const connection = mysql.createConnection({
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASS,
                database: process.env.DATABASE_NAME
              });

              connection.connect((err) => {
                if (err) {
                  console.error('Error connecting to database:', err);
                  res.status(440).end();
                  return;
                }else{
                  console.log('Banco de dados conectado com sucesso')
                  //procurando números do usuário (pausei pq agora é com qr code affffffffffffffffffffffff)
                }
              })
          }
      });
  }
});
  
module.exports={
    router
}