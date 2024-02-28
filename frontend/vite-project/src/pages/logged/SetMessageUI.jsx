import EmojiPicker from 'emoji-picker-react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { FaImage } from "react-icons/fa6";
import { RiErrorWarningLine } from "react-icons/ri";
import Tooltip from '@mui/material/Tooltip';
import {useState, useEffect} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { GrEmoji } from "react-icons/gr";



//as props antes de isConfig são para comunicar o componente pai o estado desse componente (<SetMessageUI/>)
export const SetMessageUI = ({handleImageFile,handleMessageValue, isConfigMessageDialogOpen, closeConfigMessageDialog}) => {

  //use state das mensagens
  const [currentMessage,setCurrentMessage] = useState(null);
  const handleCurrentMessage = (event)=>{
    setCurrentMessage(event.target.value)
    console.log('mensagem no filho')
    console.log(currentMessage)
  }

  //logica do upload de arquivos

  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName,setFileName] = useState(null);

  const handleImageChange = (event) => {
        const file = event.target.files[0];
        const file_name = file?.name;
        const allowedExtensions = /(\.png|\.webp|\.jpg)$/i; 
        if (!allowedExtensions.test(file.name)) {
          alert('Selecione uma imagem válida');
        }else{
            setFileName(file_name);
            setSelectedImage(file);
            handleImageFile(file);
        }
        };

  //manuseando toggle do emoji:
  const [isToggledEmoji,setIsToggledEmoji] = useState(false)
  const [isEmojiLoading, setIsEmojiLoading] = useState(false)

  const handleToggleEmoji = ()=>{
    setIsToggledEmoji((prev)=>(!prev))
    setIsEmojiLoading(true)
  }

  const onEmojiClick = (emojiObject,event)=>{
    var new_value = currentMessage?(currentMessage + emojiObject.emoji):emojiObject.emoji
    console.log('novo valor')
    console.log(new_value)
    setCurrentMessage((prev)=>(prev?(prev + emojiObject.emoji):emojiObject.emoji))
  }
  
  useEffect(() => {
    console.log('render')
    setIsEmojiLoading(false)
    // This will run after the component is mounted/rendered
  }, [isToggledEmoji]); // Empty dep

  useEffect(()=>{
    handleMessageValue(currentMessage);
  }, [currentMessage])

  return (
        <Dialog
        className="message_dialog"
        open={isConfigMessageDialogOpen}
        onClose={closeConfigMessageDialog}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            closeConfigMessageDialog();
          },
        }}>
            <DialogTitle>Configurar mensagem</DialogTitle>
            <DialogContent>
            <DialogContentText id="message_alert_title">
                Insira uma mensagem para o disparo
            </DialogContentText>
            <div id="message-flex">
                <div id="toggle_emoji" onClick={handleToggleEmoji}>
                    <GrEmoji />
                </div>
                {isEmojiLoading?<CircularProgress />:''}
            </div>
            <EmojiPicker className="emoji_picker" height={350} open={isToggledEmoji} onEmojiClick={onEmojiClick}/>
            <TextField
                    focused
                    value={currentMessage}
                    onChange={handleCurrentMessage}
                    className="message_box"
                    id="outlined-multiline-static"
                    label="Mensagem"
                    multiline
                    rows={11}
                    defaultValue=""
            />
            </DialogContent>
            <DialogActions>
            {/* <div id="open_emojis_button">Emojis <img id="emoji_image" src="/emoji-icon.png" alt="Emoji" /></div> */}

            <div id="on-left">
                <label id="anexar_arquivo" htmlFor="upload"><FaImage /><div>{fileName?fileName:"Anexar"}</div></label>
                <input type="file" id="upload" onChange={handleImageChange} hidden/>
                <Tooltip title="A mensagem será colada com a imagem por padrão" placement="right-start">
                    <div>
                        <RiErrorWarningLine/>
                    </div>
                </Tooltip>
            </div>
            <button id="ready_message" onClick={closeConfigMessageDialog} type="submit">Pronto!</button>
            </DialogActions>
            
        </Dialog>
  )
}


