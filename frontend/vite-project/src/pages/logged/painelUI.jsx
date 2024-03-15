import { useState, useRef, useEffect} from 'react';
import './logged.css';
import FormControl from '@mui/material/FormControl';
import { DisparadorUI } from './DisparadorUI';
import { ConexoesUI } from './ConexoesUI'; // Make sure ConexoesUI is properly imported
import { ImExit } from "react-icons/im";
import CircularProgress from '@mui/material/CircularProgress';

export const PainelUI = () => {
  const [focusedButton, setFocusedButton] = useState('disparador');
  const painelRef = useRef();






  const focusUI = (e, name) => {
    e.preventDefault();
    setFocusedButton(name);
  };

  const KillToken = (e)=>{
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.reload();

  }

 
  // Function to update dimensions of DisparadorUI

  return (
    <div id="painel">
      <form action="#" id="painel_form" ref={painelRef} onSubmit={(e)=>{e.preventDefault()}}>
        <FormControl  sx={{ m: 1, minWidth: 120 }} size="small">
          <div id="nav_container">
            <button
              href="#"
              onClick={(e) => focusUI(e, 'disparador')}
              className={'nav_item' + (focusedButton === 'disparador' ? ' focused' : '')}
            >
              Disparador
            </button>
            <button
              href="#"
              onClick={(e) => focusUI(e, 'conexoes')}
              className={'nav_item' + (focusedButton === 'conexoes' ? ' focused' : '')}
            >
              Conexões
            </button>
            {focusedButton === 'disparador'?<button id="logout" onClick={(e)=>KillToken(e)}>Sair <ImExit/></button>:''}
          </div>
          {focusedButton === 'disparador' ? (
            <DisparadorUI />
          ) : (
            <ConexoesUI />
          )}
        </FormControl>
      </form>
    </div>
  );
};
