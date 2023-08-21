import {Avatar, Box, Container, InputAdornment, TextField, Typography} from "@mui/material";
import {useCallback, useRef, useState} from "react";
import ChatUI from "./components/ChatUI";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import {authedRequest} from "../../services/chatGPTService";
import Sending from "./components/Sending";
import RobotIcon from '../../assets/images/robot.png';
let messagesStore = [];
export default function ChatGpt() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef();
  const calculateRows = (text) => {
    const lineBreaks = (text.match(/\n/g) || []).length + 1;
    return Math.min(5, lineBreaks + 1); // Maximum 5 rows
  };

  const handleChange = (event) => {
    const newText = event.target.value;
    setPrompt(newText);
  };

  const handleSendUserMessage = () => {
    const userMessage = {
      "role": "user",
      "content": prompt
    };
    messagesStore.push(userMessage);
    setMessages([...messagesStore]);
  }
  const handleClickSend = useCallback(async () => {
    try {
      setLoading(true);
      const userMessage = {
        "role": "user",
        "content": prompt
      };
      const res = await authedRequest.post(`https://api.openai.com/v1/chat/completions`, {
        "model": "gpt-3.5-turbo",
        "messages": [
          ...messages,
          userMessage
        ],
        "temperature": 0.7
      });
      if (res && res.data) {
        const data = res.data;
        if (data.choices.length > 0) {
          messagesStore.push(data.choices[0].message);
          setMessages([...messagesStore]);
          setPrompt('');
          if (messagesRef.current) {
            messagesRef.current.scrolltop = messagesRef.current.scrollHeight;
          }
        }
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }, [messages, prompt])



  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            智能助手
          </Typography>
        </Toolbar>
      </AppBar>
      <Box overflow={'auto'}
           ref={messagesRef}
           height={'75vh'}>
        <ChatUI loading={loading} messages={messages}/>
      </Box>
      <Box padding={'20px'}>
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position={'end'}>
                <IconButton
                  onClick={() => {
                    handleSendUserMessage();
                    handleClickSend();
                  }}
                  color={'primary'}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          label="输入您的提示"
          multiline
          rows={calculateRows(prompt)}
          value={prompt}
          onChange={handleChange}
          variant={'outlined'}
          fullWidth
        />
      </Box>
    </Box>
  )
}