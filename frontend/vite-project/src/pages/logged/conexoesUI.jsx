import './logged.css'
import { BsQrCode } from "react-icons/bs";
import { TbPlugConnected } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import {useState} from 'react';
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





export const ConexoesUI = () => {//receber o token de conexões
   //gestão visual de dialogos
  const [QRdialogOpen, setQRdialogOpen] = useState(false);

  const openQRDialog = (e)=>{
    e.preventDefault()
    setQRdialogOpen(true)
  }

  const closeQRDialog = (e)=>{
    e.preventDefault()
    setQRdialogOpen(false)
  }

  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openDeleteDialog = (e)=>{
    e.preventDefault()
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = (e)=>{
    e.preventDefault()
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
        setSelected_connection_to_delete(event.target.value);
      };

  //gerenciando criação de tabelas

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Conexão 1', '20/02/2024'),
    createData('Conexão 2', '20/02/2024'),
    createData('Conexão 3', '20/02/2024'),
    createData('Conexão 4', '20/02/2024'),
    createData('Conexão 5', '20/02/2024'),
  ];

  return (
    <>
        <button className="connection_button" onClick={(e)=>openQRDialog(e)} id="generate_qrcode"><div>Criar conexão</div><BsQrCode id="qr_code_icon" className="connections_generic_icon"/></button>
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
            />
            </DialogContent>
            <DialogActions>
            <button id="cancel_qr_code" onClick={closeQRDialog}>Cancelar</button>
            <button id="go_gen_qr_code" type="submit">Gerar QR Code</button>
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
                    <TableCell align="left">Conectado em</TableCell>
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
                    <TableCell align="left">{row.calories}</TableCell>
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
                <MenuItem value="">
                  <em>Nenhuma conexão encontrada</em>
                </MenuItem>
                <MenuItem value={10}>Conexão 1</MenuItem>
                <MenuItem value={20}>Conexão 2</MenuItem>
                <MenuItem value={30}>Conexão 3</MenuItem>
            </Select>
            </DialogContent>
            <DialogActions>
            <button id="cancel_remove_connection" onClick={closeDeleteDialog}>Cancelar</button>
            <button id="go_remove_connection" type="submit">Deletar</button>
            </DialogActions>
        </Dialog>
    </>
  )
}


