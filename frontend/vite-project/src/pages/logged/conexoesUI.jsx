import './logged.css'
import { BsQrCode } from "react-icons/bs";
import { TbPlugConnected } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
import { toast, ToastContainer } from 'react-toastify';






export const ConexoesUI = () => {//receber o token de conexões
   //gestão visual de dialogos

   const [connectionName, setConnectionName] = useState('');

   console.log(connectionName)

  const [QRdialogOpen, setQRdialogOpen] = useState(false);

  const openQRDialog = (e)=>{
    setQrCode(null)
    setConnectionName('')
    e.preventDefault()
    setQRdialogOpen(true)
  }

  const closeQRDialog = (e)=>{
    setUpdateConnectionsList((prev)=>!prev)
    setExistingConnection(null)
    e?.preventDefault()
    if(!qrLoading){
      setQrCode(false)
      setQRdialogOpen(false)
    }
  }

  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openDeleteDialog = (e)=>{
    e?.preventDefault()
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = (e)=>{
    e?.preventDefault()
    setDeleteDialogOpen(false)
  }



  const [OpenConnections, setOpenConnections] = useState(false);

  const openShowConnections = (e)=>{
    e.preventDefault()
    setOpenConnections(true)
  }

  const closeShowConnections = (e)=>{
    e.preventDefault()
    setOpenConnections(false)
  }

  //gerenciar lista da conexão a ser deletada

  const [selected_connection_to_delete, setSelected_connection_to_delete] = useState('');
    
  const handleChange_on_delete_connection = (event) => {
        console.log('DETECTANDO CONEXAO')
        console.log(event.target.value)
        setSelected_connection_to_delete(event.target.value);
      };


  const [existingConnection,setExistingConnection] = useState(null)

  const manageConnectionName = (val)=>{
    setExistingConnection(null)
    setConnectionName(val)
    console.log(val)
  }

  const [qrCode, setQrCode] = useState(null)

  const [qrLoading, setQrLoading] = useState(null)

  const request_qrCode = async ()=>{
    setQrLoading(true)
    console.log('teste')
    const token = localStorage.getItem('token');
    try{
      console.log('INICIANDO REQUEST QR CODE')
      const response = await axios.post('http://127.0.0.1:3050/qrcode',{
        connection_name: connectionName
      },{
        headers: {
          'token': `${token}`,
          'Content-Type': 'application/json'
      }
      })

      const qr_code = response.data
      setQrLoading(false)
      setExistingConnection(false)
      if(qr_code){
        setQrCode(qr_code)
      }
      console.log(qr_code)
    }catch (error) {
      setQrLoading(false)
      if (error instanceof Error && error.message.startsWith('Fetch failed with status code')) {
        // Extract and handle the status code from the error message
        const statusCode = parseInt(error.message.split(' ')[5]);
        console.log('Error with status code:', statusCode);

        // Now you can handle specific status codes
        if (statusCode !== 405) {
            // Unauthorized
            setExistingConnection(true);
            console.log('SESSÃO EXISTENTE');
        }else{
          console.log('erro ao limpar cache')
        }
    } else {
        // Handle other errors not related to the fetch request
        console.log('Error:', error);
    }
  }
  }

    //gerenciando criação de tabelas

    function createData(name, calories, fat, carbs, protein) {
      return { name, calories, fat, carbs, protein };
    }
  
    const [historicConnections, setHistoricConnections] = useState(null)

    const [updateConnectionsList, setUpdateConnectionsList] = useState(null)

    const [isConnectionDeleted, setIsConnectionDeleted] = useState(null);

    const [deleteLoading,setDeleteLoading] = useState(null);

    const DeleteConnection = async()=>{
      const token = localStorage.getItem('token');
      console.log('CONEXAO A SER DELETADA')
      console.log(selected_connection_to_delete)
      if(!selected_connection_to_delete){
        return
      }
      try{

        setDeleteLoading(true)

        const response = await axios.post('http://127.0.0.1:3050/delete_connection',{
          connection_name: selected_connection_to_delete
        },{
          headers: {
            'token': `${token}`,
            'Content-Type': 'application/json'
        }
        })

        setDeleteLoading(false)

        toast.success("Conexão deletada com sucesso", {
          position: "top-right"
        }
        );

        closeDeleteDialog()

        setIsConnectionDeleted(true)

      }catch(error){
        setDeleteLoading(false)
        setIsConnectionDeleted(false)
        console.log(error)
      }
    }
  
    useEffect(()=>{
      console.log('use effect triggerado')
      const get_connections = async()=>{
        try{
          const token = localStorage.getItem('token');
          const response_connections = await axios.get('http://127.0.0.1:3050/connections',{
            headers: {
              'token': `${token}`,
              'Content-Type': 'application/json'
          }
          })
    
          const user_connections = response_connections.data;
          if(user_connections){
            setHistoricConnections(user_connections)
          }else{
            setHistoricConnections(false)
          }
          console.log(user_connections);
        }catch(error){
          console.log(error)
        }
      }
      get_connections()
    },[updateConnectionsList, isConnectionDeleted])
  
    var rows = []
  
    if(historicConnections?.length){
      console.log(historicConnections)
  
      historicConnections.map((element,index)=>{
        rows.push(createData(element, 'conectado'))
      })
    }else{
      console.log('BUGADO')
      console.log(historicConnections)
      if(historicConnections===null){
        rows.push(createData('Carregando conexões', ''))
      }
      else if(historicConnections===false || historicConnections?.length===0){
        rows.push(createData('Nenhuma conexão encontrada', ''))
      }
    }

    //toda vez que o nome da conexão mudar


    useEffect(()=>{
     console.log('qr code state has changed')
     const pseudo_qr_webhook = async ()=>{
      console.log('STATUS CONEXÃO USEEFFECT')
      console.log('connection usada')
      console.log(connectionName)
      if(qrCode){
        try{
          const token = localStorage.getItem('token');
          const response_is_connected = await axios.get('http://127.0.0.1:3050/is_wpp_connected', {
            params: { connection_name: connectionName }, // Pass connectionName as a query parameter
            headers: {
                'token': token, // No need for interpolation here
                'Content-Type': 'application/json'
            }
        });
  
          console.log('status da conexão')
          if(response_is_connected.data.instance.state==='open'){
            console.log('TELEFONE CONECTADO')
            toast.success("Telefone conectado com sucesso", {
              position: "top-right"
            }
            );
            closeQRDialog();
         }
        }catch(error){
          console.log(error)
        }
        }
      }
    // Start the execution
    if(qrCode){
      var interval = setInterval(pseudo_qr_webhook, 3000)
    }else{
      try{
        clearInterval(interval)
      }catch{
        console.log('ignored')
      }
    }

    return () => {
      clearInterval(interval);
      console.log('Interval cleared');
    };
    },[qrCode])



  return (
    <>
        {qrCode?(<img id="qr_image" src={qrCode}/>):null}
        <button className="connection_button" onClick={(e)=>openQRDialog(e)} id="generate_qrcode"><div>Criar conexão</div><BsQrCode id="qr_code_icon" className="connections_generic_icon"/></button>
        <ToastContainer />
        <Dialog
        open={QRdialogOpen}
        onClose={closeQRDialog}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
          },
        }}>
            <DialogTitle>Gerar nova conexão</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Uma conexão é um aparelho conectado
            </DialogContentText>
            <TextField
                autoFocus
                required
                label="Insira o nome da conexão"
                fullWidth
                variant="standard"
                onChange={(e)=>{manageConnectionName(e.target.value)}}
            />
            {existingConnection?(<div id="existing_connection">a conexão já existe</div>):null}
            </DialogContent>
            <DialogActions>
            <button id="cancel_qr_code" className={"cancel_qr_code " + (qrLoading?"unabled":null)} onClick={closeQRDialog}>Cancelar</button>
            {!qrLoading?(<button id="go_gen_qr_code" className = {"go_gen_qr_code " + (connectionName||qrLoading?'':'unabled') } type="submit" onClick={request_qrCode}>Gerar QR Code</button>):(<button id="go_gen_qr_code" className = {"go_gen_qr_code unabled loading" } type="submit"><CircularProgress id="mini_circular_progress" color="inherit" /></button>)}
            </DialogActions>
        </Dialog>
        <button className="connection_button" onClick={(e)=>{openShowConnections(e)}} id="list_conections"><div>Lista de conexões</div><TbPlugConnected id="tomada_icon" className="connections_generic_icon"/></button>
        <Dialog
        open={OpenConnections}
        onClose={closeShowConnections}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
          },
        }}>
    <DialogTitle>Lista de conexões</DialogTitle>
        <DialogActions>
        {/* <div id="table_container"> */}
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Conexão</TableCell>
                    <TableCell align="left">Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell id="conectado" align="left">{row.calories}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <button id="close_connections_list" onClick={closeShowConnections}>Fechar</button>
            {/* </div> */}
            </DialogActions>
        </Dialog>

        <button className="connection_button" onClick={(e)=>{openDeleteDialog(e)}} id="delete_connection"><div>Deletar conexão</div><GoTrash id="trash_icon" className="connections_generic_icon"/></button>
        <Dialog
        open={DeleteDialogOpen}
        onClose={closeDeleteDialog}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
          },
        }}>
            <DialogTitle>Deletar conexão</DialogTitle>
            <DialogContent>
            <Select
                className="generic_painel_input"
                value={selected_connection_to_delete}
                onChange={handleChange_on_delete_connection}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {!historicConnections?(<MenuItem value="">
                  <em>Nenhuma conexão encontrada</em>
                </MenuItem>):(
                    historicConnections.map((con,indexx)=>(
                      <MenuItem key={indexx} value={con}><em>{con}</em></MenuItem>
                    ))
                    // <MenuItem value={20}>Conexão 2</MenuItem>
                    // <MenuItem value={30}>Conexão 3</MenuItem>
                )}
            </Select>
            </DialogContent>
            <DialogActions>
            <button id="cancel_remove_connection" onClick={closeDeleteDialog}>Cancelar</button>
            {!deleteLoading?(<button id="go_remove_connection" onClick={DeleteConnection} type="submit">Deletar</button>):(<button id="go_remove_connection" className="go_remove_connection loading" type="submit"><CircularProgress id="mini_circular_progress" color="inherit" /></button>)}
            </DialogActions>
        </Dialog>
    </>
  )
}


