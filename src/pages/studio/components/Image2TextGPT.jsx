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
  import axios from "axios";
import { useSelector } from "react-redux";
  
  export const ImageGPT = ({open = true, onClose, onSubmit, html, imgFileName}) => {
    const serverURL = useSelector(state => state.article.serverURL)

    // const serverURL = 'http://10.35.2.78:8000'
    const [loadingCaption, setLoadingCaption] = useState(true)

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
      async function getInitCaption() {
        setHtmlContent(html);
        const tempEl = document.createElement('div')
        tempEl.innerHTML = html

        const imgEl = tempEl.querySelector('img')
        if(imgEl){
          const src = imgEl.getAttribute('src')
          // TODO: generate caption

          try {
            console.log(imgFileName)
            const response = await axios.post(`${serverURL}/apis/caption`, {
              'fileName': imgFileName
            }
            , // 将用户输入的消息发送到后端
            );
            setLoadingCaption(false)
            if(response && response.data){
              setCaption(response.data['caption'])
            }
            
          
          } catch (error) {
            console.error('Error sending img:', error);
          }

        }
        else{
          console.log("No img el found.")
        }
      }
      getInitCaption()
    }, [html]);
  
    const handleClickSend = useCallback(async () => {
      try {
        setLoading(true);

        const res = await authedRequest.post(`${serverURL}/apis/image2Text`, {
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
              {loadingCaption? "加载中......": `这张图片好像是关于：${caption}的。您可以跟我讲一讲其中的故事吗？我会根据您的讲述帮您生成文字！`}
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