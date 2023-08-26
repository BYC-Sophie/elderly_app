import * as React from 'react'
import {Avatar, Box, Container, InputAdornment, TextField, Typography, Stack, Divider, Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";
import {useCallback, useRef, useState, useEffect} from "react";
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
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addArticleContents } from '../../reducers/article.slice';

// let messagesStore = [];

export default function ChatGpt() {
  // const [prompt, setPrompt] = useState('');
  // const [messages, setMessages] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const messagesRef = useRef();
  // const calculateRows = (text) => {
  //   const lineBreaks = (text.match(/\n/g) || []).length + 1;
  //   return Math.min(5, lineBreaks + 1); // Maximum 5 rows
  // };

  // const handleChange = (event) => {
  //   const newText = event.target.value;
  //   setPrompt(newText);
  // };

  // const handleSendUserMessage = () => {
  //   const userMessage = {
  //     "role": "user",
  //     "content": prompt
  //   };
  //   messagesStore.push(userMessage);
  //   setMessages([...messagesStore]);
  // }
  // const handleClickSend = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const userMessage = {
  //       "role": "user",
  //       "content": prompt
  //     };
  //     const res = await authedRequest.post(`https://api.openai.com/v1/chat/completions`, {
  //       "model": "gpt-3.5-turbo",
  //       "messages": [
  //         ...messages,
  //         userMessage
  //       ],
  //       "temperature": 0.7
  //     });
  //     if (res && res.data) {
  //       const data = res.data;
  //       if (data.choices.length > 0) {
  //         messagesStore.push(data.choices[0].message);
  //         setMessages([...messagesStore]);
  //         setPrompt('');
  //         if (messagesRef.current) {
  //           messagesRef.current.scrolltop = messagesRef.current.scrollHeight;
  //         }
  //       }
  //     }
  //     console.log(messagesStore)
  //   } catch (err) {

  //   } finally {
  //     setLoading(false);
  //   }

  // }, [messages, prompt])

  	const [isGenerating, setIsGenerating] = useState(false)
	const [isLoadingResponse, setIsLoadingResponse] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [showRegenerateInput, setShowRegenerateInput] = useState(false);
	const [regenerateInput, setRegenerateInput] = useState('');
	const [generatedArticle, setGeneratedArticle] = useState("我上周有幸去了香港，这是一次非常有趣的旅行。在香港，我参观了香港科技大学和香港中文大学，这两所大学给我留下了深刻的印象。香港中文大学坐落在一个广阔而美丽的校园中，风景绝佳，给人一种宁静而舒适的感觉。然而，与市区相比，它略微偏远了一些。而香港科技大学则更加注重学术氛围，给人一种严谨而专注的感觉。从学校的位置来看，它靠近海边，可以欣赏到壮丽的海景。\n\n\
除了大学，我还去了香港的南丫岛。在岛上，我品尝了正宗的烧烤和西米露，味道非常美味。在岛上散步时，我欣赏着迷人的风景，感受着海风的拂面。虽然没有遇到什么特别有趣的人和经历，但我对南丫岛的美景和美食印象深刻。\n\n\
这次香港之行让我再次感受到了香港的独特魅力。无论是追寻学术的热忱，还是品味美食的满足，香港都能够给人带来难忘的经历。我希望有机会能再次回到这个令人神往的地方，继续发掘更多的惊喜和美好。");
	const articleContents = useSelector(state => state.article.articleContents)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [messages, setMessages] = useState([
	{
		text: '您好！我是智能助手。您可以简要介绍一下您想分享的经历吗？我会引导帮助您完成创作！',
		isUser: false, // Bot message
	},
	]);

	useEffect(() => {
		async function fetchUserInfo() {
			axios.get('user/getUser').then((resp) => {
				const { data } = resp
				
				// console.log('config', config);
			})
			// console.log('config', config);
		}

		
	}, [])

	const addToEditTab = () => {
		const generatedParagraphs = generatedArticle.split(/\n+/)
		console.log(generatedParagraphs)
		console.log(articleContents)

		generatedParagraphs.forEach(element => {
			dispatch(addArticleContents({
				content: element,
				delta: {
							ops: [
								{insert: element.content}
							]
						}
			}))
		});
		handleCloseDialog()
		navigate("/studio")

	}
	
	const regenerateSampleArticle = async (userInstruction) => {

		setIsGenerating(true)
		try {
			const textData = {"text": generatedArticle, "instruction": userInstruction}
		  	const response = await axios.post('http://localhost:8000/apis/regenerate', 
			textData, // 将用户输入的消息发送到后端
		  );
	  
		  const responseArticle = response.data.text
		  console.log(response.data)
		  setGeneratedArticle(responseArticle)
	  
		} catch (error) {
		  console.error('Error sending message:', error);
		}

		setIsGenerating(false)
	}

	// 发送userMessage到后端
	const sendMessage = async (text) => {
		if (text.trim() === '') {
		  return;
		}
	  
		const newUserMessage = {
		  text,
		  isUser: true,
		};
		// 更新messgaes，后端目前没存messages，都放这了
		setMessages((prevMessages) => [...prevMessages, newUserMessage]);
	  
		setIsLoadingResponse(true)
		try {
			const chatHistory = [...messages, newUserMessage]
		  	const response = await axios.post('http://localhost:8000/apis/chatCompletion', {
			chatHistory, // 将用户输入的消息发送到后端
		  });
		  setIsLoadingResponse(false)
	  
		  const botResponse = {
			text: response.data.text, // 使用后端返回的消息作为机器人响应
			isUser: false,
		  };
	  
		  setMessages((prevMessages) => [...prevMessages, botResponse]);

		} catch (error) {
			setIsLoadingResponse(false)
		  	console.error('Error sending message:', error);
		}
	  
		// 清空输入框内容
		const inputElement = document.querySelector('input[type="text"]');
		inputElement.value = '';
	  };

	const [openDialog, setOpenDialog] = useState(false);

	// 生成文章
	const handleOpenDialog = async () => {

		setIsGenerating(true)
		setOpenDialog(true)
		// const newUserMessage = {
		// 	text: "没有什么要补充的了，请根据以上对话生成写作，只输出写作即可",
		// 	isUser: true,
		// }
		// try {
		// 	const chatHistory = [...messages, newUserMessage]
		// 	const response = await axios.post('http://localhost:8000/apis/chatCompletion', {
		// 	chatHistory, // 将用户输入的消息发送到后端
		// 	});
		// 	setGeneratedArticle(response.data.text)

		// } catch (error) {
		// 	console.error('Error sending message:', error);
		// }

		
		setIsGenerating(false)
		// setTimeout(() => {
		// 	setIsGenerating(false);
		// }, 2000);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setShowRegenerateInput(false);
	};


  // return (
  //   <Box>
  //     <AppBar position="static">
  //       <Toolbar>
  //         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
  //           智能助手
  //         </Typography>
  //       </Toolbar>
  //     </AppBar>
  //     <Box overflow={'auto'}
  //          ref={messagesRef}
  //          height={'75vh'}>
  //       <ChatUI loading={loading} messages={messages}/>
  //     </Box>
      
  //     <Box padding={'20px'}>
  //       <TextField
  //         InputProps={{
  //           endAdornment: (
  //             <InputAdornment position={'end'}>
  //               <IconButton
  //                 onClick={() => {
  //                   handleSendUserMessage();
  //                   handleClickSend();
  //                 }}
  //                 color={'primary'}>
  //                 <SendIcon />
  //               </IconButton>
  //             </InputAdornment>
  //           )
  //         }}
  //         label="输入消息..."
  //         multiline
  //         rows={calculateRows(prompt)}
  //         value={prompt}
  //         onChange={handleChange}
  //         variant={'outlined'}
  //         fullWidth
  //       />
  //     </Box>
  //   </Box>
  // )
  return (
		<Box className='page' sx={{backgroundColor: "#F8F8F8"}}>
			<Stack direction='column'>
				
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography
						align='left'
						sx={{
						m: 2,
						display: 'inline',
						fontSize: 24,
						fontWeight: 'bold',
						}}
					>
						智能助手
					</Typography>
					<Button variant='contained' onClick={handleOpenDialog} sx={{ marginRight: '16px' }}>
						生成文章
					</Button>
					</Box>
				<Divider />

					<Stack direction='column' sx={{ overflow: 'auto' }}>
						<Box
						sx={{
							height: '65vh',
							m: 2,
							borderRadius: 3,
							p: 2,
							backgroundColor: 'rgba(245, 182, 18, 0.2)',
							overflow: 'auto',
						}}
						>
						{messages.map((message, index) => (
							<Box
							key={index}
							sx={{
								display: 'flex',
								justifyContent: message.isUser ? 'flex-end' : 'flex-start',
								mb: 1,
							}}
							>
							<Typography
								sx={{
								fontWeight: 'bold',
								fontSize: 18,
								p: 1,
								backgroundColor: message.isUser ? '#f5f5f5' : '#e0e0e0',
								borderRadius: '8px',
								}}
							>
								{message.text}
							</Typography>
							</Box>
						))}
						</Box>
						<Box sx={{ height: window.innerHeight * 0.1 }} />

						{/* Input area */}
						<Box
							sx={{
							position: 'fixed',
							bottom: 58,
							left: 0,
							right: 0,
							backgroundColor: 'white',
							padding: '8px',
							borderTop: '1px solid #ccc',
							display: 'flex',
							alignItems: 'center',
							}}
						>
							<TextField
								label='输入消息...'
								variant='outlined'
								sx={{ flex: 1, marginRight: '8px' }}
								onKeyDown={(e) => {
								if (e.key === 'Enter') {
									sendMessage(e.target.value);
									e.target.value = '';
								}
								}}
							/>
							<Button
								variant='contained'
								onClick={(e) => {
								const inputElement = document.querySelector('input[type="text"]');
								sendMessage(inputElement.value);
								inputElement.value = '';
								}}
							>
								{isLoadingResponse?"加载中...":"发送"}
							</Button>
							</Box>

						{/* 弹出窗口 */}
						<Dialog
							open={openDialog}
							onClose={handleCloseDialog}
							sx={{ width: '100%', maxWidth: '800px' }} // 调整大小
						>
						<DialogTitle
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
							>
							{showRegenerateInput ? '重新生成文章' : '生成的文章'}
							<IconButton
								edge='end'
								color='inherit'
								onClick={handleCloseDialog}
								aria-label='close'
							>
								<CloseIcon />
							</IconButton>
						</DialogTitle>
						<DialogContent>
							{isGenerating ? (
								<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
									<Typography>文章生成中...</Typography>
								</Box>
								) : showRegenerateInput ? (
								<TextField
									label='您想怎么修改呢？'
									variant='outlined'
									fullWidth
									multiline
									rows={6}
									value={regenerateInput}
									onChange={(e) => setRegenerateInput(e.target.value)}
								/>
							) : (
								generatedArticle.split('\n').map((line, index) => (
									<React.Fragment key={index}>
									{line}
									<br />
									</React.Fragment>
								))
							)}
						</DialogContent>
						<DialogActions>
							{showRegenerateInput ? (
							<>
								<Button
								onClick={() => setShowRegenerateInput(false)}
								variant='contained'
								>
								取消
								</Button>
								<Button
								variant='contained'
								onClick={() => {
									// 在后端重新生成文章并更新 generatedArticle
									regenerateSampleArticle(regenerateInput)
									setShowRegenerateInput(false); // 关闭重新生成输入框
								}}
								>
								确认
								</Button>
							</>
							) : (
							<>
								
								<Button
									variant='contained'
									onClick={() => {
										setShowRegenerateInput(true); // 显示重新生成输入框
									}}
								>
									重新生成
								</Button>
								<Button
									variant='contained'
									onClick={() => {
										// TODO: 把文章添加到edit tab
										addToEditTab()
									}}
								>
									自行编辑
								</Button>
							</>
							)}
						</DialogActions>
						</Dialog>
					</Stack>
				<Box sx={{ height: window.innerHeight * 0.1 }} />
			</Stack>
		</Box>
	)
}