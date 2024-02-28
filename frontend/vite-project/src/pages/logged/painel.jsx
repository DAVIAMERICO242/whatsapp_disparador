import axios from 'axios'
import {useEffect,useState } from 'react';
import { useNavigate} from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import {PainelUI} from './PainelUI'



export const Painel = () => {
  const [isAuth,setIsAuth] = useState(null);
  const navigateTo = useNavigate();
  useEffect(()=>{
    const check_private_route = async()=>{
        try{
            const token = localStorage.getItem('token');
            await axios.get('http://127.0.0.1:3050/private_route', {withCredentials: true, headers:{
                'token': `${token}`,
                'Content-Type': 'application/json'
            } });
            setTimeout(() => {
                navigateTo('/painel')
            }, 2000);
            setIsAuth(true)
        }
        catch{
            navigateTo('/login')
            setIsAuth(false)
        }
    }
    check_private_route();
  },[])
  return (
    <>
      {isAuth===null? (
      <>
      <Stack sx={{ width: '100%'}} spacing={2}>
            <LinearProgress id="painel_top_progress"/>
      </Stack>
      </>
      ):(isAuth?(
            <PainelUI/>
      ):(<div>Forbidden</div>))}
    </>
    )
}


