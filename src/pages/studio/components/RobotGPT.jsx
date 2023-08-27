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
import { useSelector } from 'react-redux';

export const RobotGPT = ({open = true, onClose, editingWord, onSubmit, html}) => {
  const serverURL = useSelector(state => state.article.serverURL)
  const [word, setWord] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const handleClickSubmit = () => {
    onSubmit && onSubmit(htmlContent);
  }

  useEffect(() => {
    setHtmlContent(html);
  }, [html]);

  const handleClickSend = useCallback(async () => {
    try {
      setLoading(true);
      // const userMessage = {
      //   "role": "user",
      //   "content": `
      //         我有一个富文本格式的段落: ${htmlContent}. 
      //         现在我会给你下面的提示，你来帮我修改这个富文本格式的段落，
      //         修改提示为：
      //         "{${word}}".
      //         \n
      //         你只需要输出修改后的内容
      //       `
      // };
      const data = {
        "text": htmlContent,
        "instruction": word
      }
      console.log(data)
      const res = await authedRequest.post(`${serverURL}/apis/regenerate`, {
          "text": htmlContent,
          "instruction": word
      });
      // if (res && res.data) {
      //   const data = res.data;
      //   if (data.choices.length > 0) {
      //     console.log(data)
      //     const gptResponse = data.choices[0].message.content;
      //     // setMessages([...messages, userMessage, data.choices[0].message]);
      //     setHtmlContent(gptResponse);
      //   }
      // }
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

  useEffect(() => {
    if (editingWord) {
      setWord(`"${editingWord}"`);
    }
  }, [editingWord]);

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>
        <Box className={'d-flex align-items-center'}>
          <Avatar
            className={'me-2'}
            src={RobotIcon}/>
          <Typography className={'me-auto'} >
            如果需要我的帮助，请描述您的修改建议
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
          label={'输入您的想法，让智能助手帮你修改'}
        ></TextField>
        <Box className={'mt-3'}>
          <Stack direction={'row'} spacing={2}>
            <Button
              onClick={handleClickSend}
              startIcon={<LoopIcon className={loading ? style.rotate : ''}/>}>发送</Button>
            <Button
              onClick={handleClickSubmit}
              className={'ms-auto'} variant={'contained'}>确认</Button>
            <Button
              onClick={onClose}
              variant={'contained'} color={'inherit'}>取消</Button>
          </Stack>
        </Box>
      </DialogContent>

    </Dialog>
  )
}