import {
    Avatar,
    Dialog,
    DialogTitle,
    Drawer,
    Box,
    Typography,
    IconButton,
    DialogContent,
    TextField, Stack, Button
  } from "@mui/material";
  import RobotIcon from '../../../assets/images/robot.png';
  import React, {useCallback, useEffect, useState} from "react";
  import CloseIcon from "@mui/icons-material/Close";
  import LoopIcon from '@mui/icons-material/Loop';
  import {authedRequest} from "../../../services/chatGPTService";
  import style from '../style.module.css';
  export const ImageGPT = ({open = true, onClose, onSubmit, html}) => {
  
    const [word, setWord] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [caption, setCaption] = useState('');
    const [imgsrc, setImgsrc] = useState('');

    const handleClickSubmit = () => {
      onSubmit && onSubmit(htmlContent);
    }
  
    useEffect(() => {
      setHtmlContent(html);
      const tempEl = document.createElement('div')
      tempEl.innerHTML = html

      const imgEl = tempEl.querySelector('img')
      if(imgEl){
        const src = imgEl.getAttribute('src')
        // TODO: generate caption
        setCaption("sample image caption")
      }
      else{
        console.log("No img el found.")
      }
      
    }, [html]);
  
    const handleClickSend = useCallback(async () => {
      try {
        setLoading(true);

        const data = {
          "text": htmlContent,
          "instruction": word
        }
        console.log(data)
        const res = await authedRequest.post(`http://localhost:8000/apis/image2Text`, {
            "caption": caption,
            "description": word
        });

        if (res && res.data){
          const gptResponse = res.data["text"]
          console.log(gptResponse)
          setHtmlContent(gptResponse)
        }
      } catch (err) {
  
      } finally {
        setLoading(false);
      }
    }, [messages, word]);
  
    // useEffect(() => {
    //   if (editingWord) {
    //     setWord(`"${editingWord}"`);
    //   }
    // }, [editingWord]);
  
    return (
      <Dialog fullWidth open={open}>
        <DialogTitle>
          <Box className={'d-flex align-items-center justify-content-between'}>
            <Avatar
              className={'me-2'}
              src={RobotIcon}/>
            <Typography className={'me-auto'} >
              {caption}
            </Typography>
            <IconButton>
              <CloseIcon onClick={onClose}/>
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {html && (
            <div dangerouslySetInnerHTML={{
              __html: htmlContent
            }} style={{
              wordBreak: 'break-all'
            }}></div>
          )}
          <TextField
            multiline
            rows={5}
            value={word}
            onChange={e => {
              setWord(e.target.value)
            }}
            fullWidth
            className={'mt-2'}
            label={'您可以展开讲讲这张图片吗？'}
          ></TextField>
          <Box className={'mt-3'}>
            <Stack direction={'row'} spacing={2}>
              <Button
                onClick={handleClickSend}
                startIcon={<LoopIcon className={loading ? style.rotate : ''}/>}>发送</Button>
              <Button
                onClick={handleClickSubmit}
                className={'ms-auto'} variant={'contained'}>确定</Button>
              <Button
                onClick={onClose}
                variant={'contained'} color={'inherit'}>取消</Button>
            </Stack>
          </Box>
        </DialogContent>
  
      </Dialog>
    )
  }