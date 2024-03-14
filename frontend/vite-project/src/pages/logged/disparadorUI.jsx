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
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';




export const DisparadorUI = () => {

  const [historicConnections, setHistoricConnections] = useState(null)

    useEffect(()=>{
      console.log('use effect triggerado no pai')
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
    },[]);

    const [historicCampaigns, setHistoricCampaigns] = useState(null)

    useEffect(()=>{
      console.log('use effect triggerado no pai campanha')
      const get_campaigns = async()=>{
        try{
          const token = localStorage.getItem('token');
          const response_campaigns = await axios.get('http://127.0.0.1:3050/campaigns',{
            headers: {
              'token': `${token}`,
              'Content-Type': 'application/json'
          }
          })
    
          const user_campaigns = response_campaigns.data;
          if(user_campaigns){
            setHistoricCampaigns(user_campaigns)
          }else{
            setHistoricCampaigns(false)
          }
          console.log(user_campaigns);
        }catch(error){
          console.log(error)
        }
      }
      get_campaigns()
    },[]);

    //pegando dados de campanhas e connexões
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
      if(val){
        fileToBase64(val)
      }
    }

    function fileToBase64(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result;
        console.log(base64String); // Here's the base64 representation of the file
        setImage(base64String);
      };
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

    const [isDisparing, setIsDisparing] = useState(null);

    const Disparo = async () => {
      console.log('IMAGEM DA HORA DO DISPARO 64')
      console.log(image)
      try {
          const token = localStorage.getItem('token');
          setIsDisparing(true);
          await axios.post('http://127.0.0.1:3050/disparo', {
              campaign_name: campaign,
              connection_name: connection,
              unfilter_how_many_to_disparo: selected_how_many_contacts,
              campaign_to_exclude: restrictedCampaign,
              interval_between_disparo: intervalValue,
              message: MessageInParentComponent,
              image_base64: image
          }, {
              headers: {
                  'token': `${token}`,
                  'Content-Type': 'application/json'
              }
          });
      } catch (error) {
          setIsDisparing(false);
          console.log(error);
      }
    };

    const [disparoProgress, setDisparoProgress] = useState(null);
    useEffect(() => {
      console.log('IS DISPARING CHECK')
      console.log(isDisparing)
      const token = localStorage.getItem('token');
      const ws = new WebSocket('ws://localhost:8500'); // Connect to WebSocket server
  
      ws.onopen = () => {
        console.log('WebSocket connection established');
      };
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(token===data.web_socket_user){
          console.log('Received data:', data);
          setDisparoProgress(data.disparo_progress);
          console.log('DISPARO PROGRESS')
          console.log(disparoProgress)
          if(parseInt((data?.disparo_progress)?.split('/')[0]) === parseInt((data?.disparo_progress)?.split('/')[1])){
            setIsDisparing(false);
            setDisparoProgress(null);
          }
        }
        // Handle received data, update state, etc.
      };
  
      return () => {
        ws.close(); // Close WebSocket connection when component unmounts
      };
    }, [isDisparing, disparoProgress]);


    return(
            <div className={isDisparing?'disparing':''}>
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
                {(historicConnections!==null)?(!historicConnections?(<MenuItem value="">
                  <em>Nenhuma conexão encontrada</em>
                </MenuItem>):(
                    historicConnections.map((con,indexx)=>(
                      <MenuItem key={indexx} value={con}><em>{con}</em></MenuItem>
                    ))
                    // <MenuItem value={20}>Conexão 2</MenuItem>
                    // <MenuItem value={30}>Conexão 3</MenuItem>
                )):(null)}
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
                {(historicCampaigns!==null)?(!historicCampaigns?(<MenuItem value="">
                  <em>Nenhuma campanha encontrada</em>
                </MenuItem>):(
                    ['Não restringir',...historicCampaigns].map((chan,indexx)=>(
                      !indexx?(<MenuItem key={indexx} value={'DENY_RESTRICT'}><em>Não restringir</em></MenuItem>):(<MenuItem key={indexx} value={chan}><em>{chan}</em></MenuItem>)
                    ))
                    // <MenuItem value={20}>Conexão 2</MenuItem>
                    // <MenuItem value={30}>Conexão 3</MenuItem>
                )):(null)}
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
                <Slider onChange={handleIntervalChange} marks={marks} defaultValue={8} aria-label="Default" valueLabelDisplay="auto" min={8} max={20}/>
                <button id="set_message" onClick={openConfigMessageDialog}><TbMessageCircleCog id="set_message_icon"/><div>Escrever mensagem</div></button>
                <SetMessageUI handleImageFile={handleImageFile} handleMessageValue={handleMessageValue} isConfigMessageDialogOpen={isConfigMessageDialogOpen} closeConfigMessageDialog={closeConfigMessageDialog}/>
                <button id="disparar_button" ref={refDisparo} onClick={Disparo}><IoIosSend id="aviao"/><div>Enviar</div></button>
                {isDisparing?(<Box id="disparo_progress" sx={{ width: '100%' }}>
                    <div id="disparo_progress_label">Disparando: {disparoProgress}</div>
                    <LinearProgress color="inherit" value={20}         sx={{
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: 'rgba(0, 255, 0, 0.8)' // Green color with 50% opacity
                    },
                    '& .MuiLinearProgress-bar1Determinate': {
                        backgroundColor: 'green' // Floating progress color remains unchanged
                    }
                }} />
                </Box>):null}
                <ToastContainer />
            </div>
    
    )
    }