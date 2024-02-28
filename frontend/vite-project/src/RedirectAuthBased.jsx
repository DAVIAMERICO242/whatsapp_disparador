import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


export const RedirectAuthBased = () => {
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
        }
        catch{
            navigateTo('/login')
        }
    }
    check_private_route();
  },[])

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
  
}

