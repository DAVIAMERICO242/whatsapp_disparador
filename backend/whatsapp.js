const whatsapp = require('express').Router()
const mysql = require('mysql');
require('dotenv').config();
const fetch = require('node-fetch');
const {recordCampaignOnSentMessage, NumbersFromExcludedCampaign} = require('./manage_database_disparo');
const WebSocket = require('ws'); // Assuming you're using WebSocket library
const url = require('url');


const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const wss = new WebSocket.Server({ port: 8500 }); // Example port number

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  console.log('LOCATION')
  console.log(location)
  const user = location.query.user;
  console.log("USER:", user);
  console.log('PARAMS')
  console.log(req.user)
  console.log('TOKEN DETECTADO NA CONEXÃO')
  console.log(user)
  ws.user = user; // Store token as a property of the WebSocket object

  ws.on('message', function incoming(message) {

    var progress_backup = localStorage.getItem(`${user}_progress`);
    var user_name_backup = localStorage.getItem(`${user}_user_name`);
    var fail_backup = localStorage.getItem(`${user}_fail`);

    if (message === 'pause') {
      console.log('PAUSE')
      try{
        localStorage.setItem(`${user}_pause_status`, 'paused');
        console.log(localStorage.getItem(`${user}_pause_status`));
      }catch(error){
        console.log(error);
      }
    }
    if (message === 'unpause') {
      console.log('UNPAUSE')
      try{
        localStorage.setItem(`${user}_pause_status`, 'unpaused');
      }catch(error){
        console.log(error)
      }
    }

    if(message === 'stop'){
      console.log('SERVIDOR RECEBEU REQUISIÇÃO DE STOP');
      sendProgress(progress_backup, user_name_backup, fail_backup, true);
      try{
        localStorage.setItem(`${user}_stop_status`, 'stop');
      }catch(error){
        console.log(error)
      }
    }
  });

  // Your other WebSocket handling logic...
});

function sendProgress(progress, user_name, fail, stoped) {//progresso disparo
  localStorage.setItem(`${user_name}_progress`,progress);
  localStorage.setItem(`${user_name}_user_name`,user_name);
  localStorage.setItem(`${user_name}_fail`,fail);
  wss.clients.forEach((client) => {
    console.log('USER DO CLIENTE')
    console.log(client.user)
    if (client.readyState === WebSocket.OPEN && client.user === user_name) {
      client.send(JSON.stringify({ 'web_socket_user': user_name, 'disparo_progress': progress, 'falhas':fail, 'stoped': stoped }));
    }
  });
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomAroundMean(mean, stdDev) {
  const randomFactor = (Math.random() * 2) - 1; // Generate a random number between -1 and 1
  return mean + (stdDev * randomFactor); // Adjust it based on the mean and standard deviation
}

const getWhatsappContacts = async(connection_name, user_name)=>{
  const server_connection_name = user_name?.toString() + '_' + (connection_name?.replace(/\s+/g, ' ')?.trim())?.toString();

  const headers0 = {
    'accept': 'application/json',
    'apikey': 'B6D711FCDE4D4FD5936544120E713976',
    'Content-Type': 'application/json'
  };

  try{
    const contacts = await fetch(`http://localhost:8080/chat/findContacts/${server_connection_name}`, {
      method: 'POST',
      headers: headers0
    });
    const contacts_phones = []
    const contacts_data = await contacts.json()
    contacts_data.map((element,index)=>{
      console.log(element.pushName)
      console.log(element.id)
      contacts_phones.push(element.id)
    })
    return contacts_phones.filter(e=>e)
  }catch(error){
    console.log(error)
  }

}


const sendMessage = async(connection_name, user_name,target_phone,message, image_base64)=>{
  console.log(user_name)
  console.log(connection_name)
  console.log(target_phone)
  console.log(message)
  console.log('BASE 64 INSIDE MODEL')
  console.log(image_base64?.split(',')[1])

  const headers0 = {
    'accept': 'application/json',
    'apikey': 'B6D711FCDE4D4FD5936544120E713976',
    'Content-Type': 'application/json'
  };

  const server_connection_name = user_name?.toString() + '_' + (connection_name?.replace(/\s+/g, ' ')?.trim())?.toString();


  try{
    if(image_base64){//mensagem com imagem colada
      console.log('COM IMAGEM')
      parameters = {
        "number": target_phone,
        "mediaMessage":{
          "mediatype": "image",
          "caption": message,
          "media": image_base64.split(',')[1]
        }
      }
      const response = await fetch(`http://localhost:8080/message/sendMedia/${server_connection_name}`, {
        method: 'POST',
        headers: headers0,
        body: JSON.stringify(parameters)
      })

      console.log(await response.json())

    }else{//mensagem normal
        console.log('SEM IMAGEM')
        parameters = {
          "number": target_phone,
          "textMessage": {
            "text": message
          }
        }
        const response = await fetch(`http://localhost:8080/message/sendText/${server_connection_name}`, {
          method: 'POST',
          headers: headers0,
          body: JSON.stringify(parameters)
        })

        console.log(await response.json())

      }
    
    return true

  } catch(error){
    console.log(error)
    return false
  }

}

const doDisparoWhatsapp = async (contacts,user_name, connection_name, campaign_name, message, image_base64, campaign_to_exclude, unfilter_how_many_to_disparo, interval_between_disparo, token)=>{
  
  try{
      //backup
      localStorage.setItem(`${user_name}_progress`,0);
      localStorage.setItem(`${user_name}_user_name`,user_name);
      localStorage.setItem(`${user_name}_fail`,0);
      //backup^
      localStorage.setItem(`${user_name}_stop_status`, 'unstoped');
      localStorage.setItem(`${user_name}_pause_status`, 'unpaused');
      console.log('LOCAL STORAGE NAO ATUALIZANDO');
      console.log(localStorage.getItem(`${user_name}_stop_status`));
      console.log('ENTROU NA FUNÇÃO DISPARO');
      console.log(`Usuário que solicitou o disparo:${user_name}`)
      console.log(`Nome da campanha: ${campaign_name}}`);
      console.log(`Conexão escolhida: ${connection_name}`);
      console.log(`Número de contatos a serem disparados (sem filtrar campanha): ${unfilter_how_many_to_disparo}`);
      console.log(`Campanha excluída: ${campaign_to_exclude}`);
      console.log(`Intervalo entre cada disparo: ${interval_between_disparo}`);
      console.log(`Mensagem a ser disparada: ${message}`);
      console.log(`Imagem a ser disparada: ${image_base64}`);

      if(!interval_between_disparo){
        return;
      }

      if(interval_between_disparo<5){
        return;
      }

      var unique_contacts = [...new Set(contacts)];


      if(campaign_to_exclude!=='DENY RESTRICT'){
        const excluded_numbers = await NumbersFromExcludedCampaign(user_name, campaign_to_exclude);
        const campaign_filtered_numbers = unique_contacts?.filter(item => !(excluded_numbers.includes(item)));
        var unique_contacts = campaign_filtered_numbers;
      }

      console.log('LEN HOW MANY TO DISPARO')
      console.log(unfilter_how_many_to_disparo.length)
      console.log('LEN UNIQUE CONTACTS')
      console.log(unique_contacts.length)

      if(unfilter_how_many_to_disparo<=unique_contacts.length){
        console.log('entrou sim')
        var unique_contacts = unique_contacts?.slice(0, unfilter_how_many_to_disparo);
      }

      if(!(unique_contacts.length)){
        return;
      }

      const iterateContacts = async () => {
        console.log('TA BIGADO?')
        console.log(unique_contacts.length)
        var fail = 0;
        for (let index = 0; index < unique_contacts.length; index++) {
          while(localStorage.getItem(`${user_name}_pause_status`)==='paused'){
            if(localStorage.getItem(`${user_name}_stop_status`)==='stop'){
              console.log('DISPARO MORTO')
              // sendProgress((index).toString() + '/' + (unique_contacts.length).toString(), user_name, true);
              return;
            }
            console.log('USUARIO PAUSOU')
            await sleep(3000);
          }
          if(localStorage.getItem(`${user_name}_stop_status`)==='stop'){
            console.log('Disparo stopado');
            // sendProgress((index).toString() + '/' + (unique_contacts.length).toString(), user_name, fail, true);
            return;
          }
          try{
            await sendMessage(connection_name, user_name, unique_contacts[index],message, image_base64);
          }catch(error){
            fail = fail + 1;
            console.log('falhas')
            console.log(fail);
          }
          sendProgress((index + 1).toString() + '/' + (unique_contacts.length).toString(), user_name, fail);
          await sleep(randomAroundMean(interval_between_disparo*1000,3000));
          try{
            await recordCampaignOnSentMessage(user_name,connection_name, campaign_name, unique_contacts[index]);
          }catch(error){
            console.log(error)
          }
        }
      }
      iterateContacts();
  }catch(error){
    console.log(error);
  }
}



const WppDeleteConnection = async(connection_name, user_name)=>{
    const headers0 = {
        'accept': 'application/json',
        'apikey': 'B6D711FCDE4D4FD5936544120E713976',
        'Content-Type': 'application/json'
      };

    const server_connection_name = user_name?.toString() + '_' + (connection_name?.replace(/\s+/g, ' ')?.trim())?.toString();
    await fetch(`http://localhost:8080/instance/logout/${server_connection_name}`, {//deletar antes
        method: 'DELETE',
        headers: headers0
      });
    const is_deleted_resp = await fetch(`http://localhost:8080/instance/delete/${server_connection_name}`, {
        method: 'DELETE',
        headers: headers0
      });

    const is_deleted = await is_deleted_resp.json()
    console.log('STATUS DA CONEXÃO')
    console.log(is_deleted)
    return is_deleted

}

const isWppConnected = async(connection_name, user_name)=>{
    const headers0 = {
        'accept': 'application/json',
        'apikey': 'B6D711FCDE4D4FD5936544120E713976',
        'Content-Type': 'application/json'
      };

    const server_connection_name = user_name?.toString() + '_' + (connection_name?.replace(/\s+/g, ' ')?.trim())?.toString();
    const is_connected_resp = await fetch(`http://localhost:8080/instance/connectionState/${server_connection_name}`, {
        method: 'GET',
        headers: headers0
      });

    const is_connected = await is_connected_resp.json()
    console.log('STATUS DA CONEXÃO')
    console.log(is_connected)
    return is_connected


}
const genQRCode = async (user_name, connection_name) => {

    //limpando instancias sem qr code gerado


    try{
        const headers0 = {
            'accept': 'application/json',
            'apikey': 'B6D711FCDE4D4FD5936544120E713976',
            'Content-Type': 'application/json'
          };
        const instances_response = await fetch('http://localhost:8080/instance/fetchInstances', {
            method: 'GET',
            headers: headers0
          });
        const instances = await instances_response.json()
        console.log('instancias')
        console.log(instances)
        console.log('testeeee')
        console.log(instances)
        console.log('tese2')

        instances.map(async (element,index)=>{
            if(element.instance?.status!='open'){
                console.log('IF ATENDIDO')
                await fetch(`http://localhost:8080/instance/delete/${element.instance.instanceName}`, {
                    method: 'DELETE',
                    headers: headers0
                });
            }
        })
    }catch(error){
        const statusCode = 405
        return {statusCode}
    }

    //gerando qr code
    const instance_name = user_name?.toString() + '_' + (connection_name?.replace(/\s+/g, ' ')?.trim())?.toString();
    
    const data = {
      instanceName: instance_name,
      token: Array(32).fill(null).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      qrcode: true
    };
  
    const headers = {
      'accept': 'application/json',
      'apikey': 'B6D711FCDE4D4FD5936544120E713976',
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await fetch('http://localhost:8080/instance/create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json();
      console.log(responseData);

      const qr_base64 = responseData.qrcode?.base64
      console.log('AFTER FULL DATA')
      console.log(qr_base64)

      const statusCode = !(responseData.status)?200:(responseData.status)
  
      return {statusCode, qr_base64}; // Retorna o status code da resposta
    } catch (error) {
      console.error('Error:', error);
      return 500; // Se houver um erro, retorna 500 (Erro interno do servidor)
    }
  }

  const WppConnections = async()=>{
    const headers = {
        'accept': 'application/json',
        'apikey': 'B6D711FCDE4D4FD5936544120E713976',
        'Content-Type': 'application/json'
      };
    const response_connections = await fetch('http://localhost:8080/instance/fetchInstances', {
        method: 'GET',
        headers: headers
      });
    console.log(response_connections)
    const data_connections = await response_connections.json()
    var connections = data_connections.map((element,index)=>{
        if(element.instance?.status=='open'){
            return (element.instance?.instanceName)
        }
      })
    var connections = connections.filter((e,i)=>e)
    console.log('CONEXÕES')
    console.log(connections)
    return connections
  }

module.exports = {
    genQRCode,WppConnections, isWppConnected,WppDeleteConnection, sendMessage, getWhatsappContacts, doDisparoWhatsapp
}

