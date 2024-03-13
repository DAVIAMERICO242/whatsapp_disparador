const whatsapp = require('express').Router()
const mysql = require('mysql');
require('dotenv').config();
const fetch = require('node-fetch');

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
    genQRCode,WppConnections, isWppConnected,WppDeleteConnection
}

