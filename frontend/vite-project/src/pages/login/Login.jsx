import { TextField } from '@mui/material';
import './login.css'
import axios from 'axios'
import skylerImage from './skyler.png'; // Import the image
import {useRef,useState} from 'react'
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';




export const Login = () => {
  const navigateTo = useNavigate();
  const [auth,setAuth] = useState(null);

  const [user,setUser] = useState('')
  const [pass,setPass] = useState('')  
  const button_ref = useRef();
  const form_ref = useRef();
  const show_login_button = (e)=>{
    button_ref.current.style.opacity = e.target.value?1:0.5;
  }
  const auth_login=(e)=>{
    e.preventDefault();
    const auth = async ()=>{
        try{
            var response = await axios.get('http://127.0.0.1:3050/auth', {
                params:{
                    user: user,
                    pass:pass
                }
            });
            setAuth(true);
            const { token } = response.data;
            console.log(token)
            localStorage.setItem('token', token)
            localStorage.setItem('user', user)
            console.log('autenticado')
            setTimeout(() => {
                navigateTo('/painel')
            }, 2000);
        }
        catch{
            setAuth(false)
        }
    }
    auth();
}

  return (
    <div id="login">
        <form action="#" id="login_form" ref={form_ref} onSubmit={(e)=>auth_login(e)}>
            <img id="logo" src={skylerImage}/>
            <div id="auth_request">Insira as credenciais para acessar o disparador</div>
            <div id="login_divider"></div>

            <div id="input_area" onChange={(e)=>show_login_button(e)}>
                <TextField onChange={(e)=>setUser(e.target.value)} label="Usuário" className="login_input" id="login_user" required/>
                <TextField onChange={(e)=>setPass(e.target.value)} label="Senha" type="password" className="login_input" id="login_pass" required/>
            </div>
            {auth === true && (
                <Stack sx={{ width: '50%', color: 'grey.500' }} spacing={2}>
                    <LinearProgress id="login_progress" color="success" />
                </Stack>
            )}
            <button id="login_button" type="submit" ref={button_ref}>Entrar</button>
            {auth !== null ? (auth ? (
                <div id="auth_login"> Autorizado </div>
            ) : (<div id="unauth_login"> Não autorizado </div>)) : null}
        </form>
    </div>
  )
}