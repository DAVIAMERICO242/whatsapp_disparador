import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {useState,useRef, useEffect} from 'react'
import './logged.css'
import { TextField } from '@mui/material';
import { IoIosSend } from "react-icons/io";
import { TbMessageCircleCog } from "react-icons/tb";
import {SetMessageUI} from "./SetMessageUI";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Slider from '@mui/material/Slider';
import { HiQuestionMarkCircle } from "react-icons/hi2";
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios'





export const DisparadorUI = () => {

    //pegando dados de campanhas e connexões
    const user_db_connections = ['a']
    const user_db_past_campaigns = ['Campaign 1', 'Campaign 2', 'Campaign 3']
    user_db_past_campaigns.unshift('Não quero restringir a nível de campanha')

    //configurando states dos campos e validando no frontend

    const [campaign, setCampaign] = useState('');
    const [isCampaignValid, setIsCampaignValid] = useState(null);
    const [connection, setConnection] = useState('');
    const [isConnectionValid, setIsconnectionValid] = useState(null);
    const [selected_how_many_contacts, setSelected_how_many_contacts] = useState('');
    const [isNumberOfContactsValid, setIsNumberOfContactsValid] = useState(null);
    const [restrictedCampaign, setRestrictedCampaign] = useState('');
    const [isRestrictedCampaignValid,setIsRestrictedCampaignValid] = useState(null);
    const [MessageInParentComponent, setMessageInParentComponent] = useState('');
    const [isMessageValid, setIsMessageValid] = useState(false);
    const [image, setImage] = useState(null);
    const [intervalValue, setIntervalValue] = useState(5);

    //salvando a mensagem no componente pai:
    const handleImageFile = (val)=>{
      setImage(val)
    }
  
    //manipular o state da mensagem é um pouco mais complexo:

    const handleMessageValue = (val)=>{//essa função é passada como propriedade para DisparadorUI
      console.log('valor da mensagem no componente pai (bruto)')
      console.log(val);
      setMessageInParentComponent(val);
      console.log('valor da mensagem no componente pai (estado)')
      console.log(MessageInParentComponent)
    }


    //configurando toggle para configurar mensagem
    const [isConfigMessageDialogOpen, setIsConfigMessageDialogOpen] = useState(false);
    const openConfigMessageDialog = (e)=>{
      e.preventDefault()
      setIsConfigMessageDialogOpen(true)
    }
    const closeConfigMessageDialog = (e)=>{
      e.preventDefault()
      setIsConfigMessageDialogOpen(false)
      console.log('valor da mensagem no componente pai AO FECHAMENTO DO DIALOGO (estado)')
      console.log(MessageInParentComponent)
      console.log('IMAGEM APOS O FECHAMENTO')
      console.log(image)

      if(MessageInParentComponent?.length>10 && MessageInParentComponent){
        setIsMessageValid(true);
        toast.success("Mensagem salva com sucesso", {
          position: "top-center"
        });
      }else{
        setIsMessageValid(false);
        toast.error("A mensagem deve ter pelomenos 10 caracteres", {
          position: "top-center"
        });
      }
    }

    //criar validação para campanha restrita
    const refDisparo = useRef();
    

    const handleCampaignChange = (event) => {
      console.log('triggerado')
      setCampaign(event.target.value);
      console.log(campaign)
      event.target.value?((event.target.value!=0)?setIsCampaignValid(true):setIsCampaignValid(false)):setIsCampaignValid(false)
    }

    const handleConnectionChange = (event) => {
        setConnection(event.target.value);
        if(event.target.value===""){
          console.log('conexao invalida')
          setIsconnectionValid(false)
        }else{
          console.log('conexao valida')
          setIsconnectionValid(true)
        }
    };

    const handleHowManyContactChange = (event) => {
      setSelected_how_many_contacts(event.target.value);
      console.log(selected_how_many_contacts)
      var try_int = parseInt(event.target.value)
      var check_number = (Number.isNaN(try_int))?false:(Number.isInteger(try_int) && (try_int > 0))
      console.log(!Number.isNaN(try_int))
      check_number?setIsNumberOfContactsValid(true):setIsNumberOfContactsValid(false)

      };

    const handleRestrictedCampChange = (event) => {
      setRestrictedCampaign(event.target.value);
      event.target.value?setIsRestrictedCampaignValid(true):setIsRestrictedCampaignValid(false)
      console.log(restrictedCampaign)
      };

    const handleIntervalChange = (e)=>{
      setIntervalValue(e.target.value);
    }
    
    useEffect(()=>{
      if((!isCampaignValid || !isConnectionValid || !isNumberOfContactsValid || !isRestrictedCampaignValid || !isMessageValid)){
        refDisparo.current.style.opacity = 0.5
        refDisparo.current.style['pointer-events'] = 'none'

      }
      else{
        console.log('entrou no else')
        refDisparo.current.style.opacity = 1
        refDisparo.current.style['pointer-events'] = ''
      }
    },[isCampaignValid,isConnectionValid, isNumberOfContactsValid, isRestrictedCampaignValid, isMessageValid])
    //trigando o disparador pelo botão enviar

    const requestDisparo = (event) =>{//vou precisar do userId e do token
      event.preventDefault();
    }

    //definindo marcadores do slider:

    const marks =[{
      value:5,
      label: '5 s'
    },
    {
      value:10,
      label: '10 s'
    },
    {
      value:15,
      label: '15 s'
    },
    {
      value:20,
      label: '20 s'
    }
    ]

    const Disparo = async () => {
      try {
          const token = localStorage.getItem('token');
          await axios.post('http://127.0.0.1:3050/disparo', {
              campaign_name: campaign,
              connection_name: connection,
              unfilter_how_many_to_disparo: selected_how_many_contacts,
              campaign_to_exclude: restrictedCampaign,
              interval_between_disparo: intervalValue,
              message: MessageInParentComponent,
              image: image
          }, {
              withCredentials: true,
              headers: {
                  'token': `${token}`,
                  'Content-Type': 'application/json'
              }
          });
      } catch (error) {
          console.log(error);
      }
    };


    return(
            <div>
              <div className="generic_painel_label">Escolha um nome para esse disparo</div>
              <TextField size="small" onChange={(e)=>handleCampaignChange(e)} label="Nome da campanha" className="generic_painel_input"/>
              {isCampaignValid===false?(<div id="invalid_field">Nome da campanha inválido</div>):null}
              <div id="divider"></div>
              <div className="generic_painel_label">Selecione uma conexão:</div>
              <Select
                className="generic_painel_input"
                value={connection}
                onChange={handleConnectionChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {!(user_db_connections.length)?(<MenuItem value="">
                  <em>Nenhuma conexão encontrada</em>
                </MenuItem>):(user_db_connections.map((e,i)=>(<MenuItem key={i} value={e}>{e}</MenuItem>)))}
              </Select>
              <div id="divider"></div>
              <div className="generic_painel_label">Escolha o número de contatos:</div>
              <TextField
                onChange={(e)=>{handleHowManyContactChange(e)}}
                size="small"
                className="generic_painel_input"
                id="filled-number"
                label="N° contatos"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
              />
              {isNumberOfContactsValid===false?(<div id="invalid_field">Número inválido</div>):null}
              <div id="divider"></div>
                <div className="generic_painel_label">Excluir desse disparo contatos que receberam disparo na campanha:</div>
                <Select
                className="generic_painel_input"
                value={restrictedCampaign}
                onChange={handleRestrictedCampChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                ({user_db_past_campaigns.map((e,i)=>(<MenuItem key={i} value={e}>{e}</MenuItem>))})
              </Select>
                <div id="divider"></div>
                <div id="label_set_interval_container">
                  <div className="generic_painel_label" id="label_set_interval">Enviar mensagem a cada:</div>
                  <Tooltip title="O tempo real entre cada mensagem é um número aleatório próximo do escolhido" placement="right-start">
                    <div>
                      <HiQuestionMarkCircle/>
                    </div>
                  </Tooltip>
                </div>
                <Slider onChange={handleIntervalChange} marks={marks} defaultValue={5} aria-label="Default" valueLabelDisplay="auto" min={5} max={20}/>
                <button id="set_message" onClick={openConfigMessageDialog}><TbMessageCircleCog id="set_message_icon"/><div>Escrever mensagem</div></button>
                <SetMessageUI handleImageFile={handleImageFile} handleMessageValue={handleMessageValue} isConfigMessageDialogOpen={isConfigMessageDialogOpen} closeConfigMessageDialog={closeConfigMessageDialog}/>
                <button id="disparar_button" ref={refDisparo} onClick={Disparo}><IoIosSend id="aviao"/><div>Enviar</div></button>
                <ToastContainer />
            </div>
    
    )
    }