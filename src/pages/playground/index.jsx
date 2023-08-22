// import {Box, Button, Container, Typography} from "@mui/material";
// import Posts from "./components/Posts";
// import {useNavigate} from "react-router-dom";
// import {Document} from "react-pdf"

// export default function Playground() {

//   const navigate = useNavigate();

//   return (
//     <Container>

//       <Box marginTop={'20px'}>
//         <Typography textAlign={'center'} variant={'h5'}>
//           美文广场
//         </Typography>
//         <Typography marginTop={'20px'}>
//           以下是前面的老人参与者完成的优秀写作。相信在智能助手的帮助下，
//           您也可以写出一样优美的文章
//         </Typography>
//       </Box>

//       <Box marginTop={'30px'}>
//         <Posts />
//       </Box>

//       <Box marginTop={'20px'}>
//         <Typography>
//           写作可以帮助记录生活，益智养生。您的佳作也能为他人带来好心情，传递自己的智慧和感悟，快来开启您的创作吧!
//         </Typography>
//       </Box>

//       <Box textAlign={'center'} marginTop={'40px'}>
//         <Button
//           onClick={() => {
//             navigate('/studio')
//           }}
//           variant={'contained'}>
//           开始创作！
//         </Button>
//       </Box>
//     </Container>
//   )
// }

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Box, Button, Divider, Stack } from '@mui/material'
import axios from 'axios'
import ArticleCard from '../../Components/ArticleCard'
import Header from '../../Components/Header'
import Sentence from '../../Components/Sentence'
import Loading from '../../Components/Loading'
import { useNavigate } from 'react-router-dom';

export default function Index() {
	const [isLoading, setIsLoading] = useState(true)
	const [previousPost, setPreviousPost] = useState([
		{
			id: 1, //用于带参数跳转: id @ user_task
			title: '第一篇文章',
			itemStyle: { backgroundColor: 'rgba(245, 182, 18, 0.8)' },
		},
		{
			id: 2,
			title: '第二篇文章',
			itemStyle: { backgroundColor: 'rgba(245, 182, 18, 0.8)' },
		},
	])
	const navigate = useNavigate()

	const handleStartClick = () => {
  		navigate('/studio');
	  };

	const sentence =
		'以下是前面的老人参与者完成的优秀写作。相信在智能助手的帮助下，您也可以写出一样优美的文章！'
	const encouragingSentence = 
		'写作可以帮助记录生活，益智养生。您的佳作也能为他人带来好心情，传递自己的智慧和感悟，快来开启您的创作吧！'

	useEffect(() => {
		async function fetchDaliyTaskBrief() {
			// axios.get('task_daily/brief/').then((resp) => {
			// 	setIsLoading(false)
			// 	const compulsory_data = resp.data.compulsory.map((item) => {
			// 		const res = {
			// 			id: item.id,
			// 			type: item.type,
			// 			title: item.title,
			// 			itemStyle: { backgroundColor: 'rgba(245, 182, 18, 0.8)' },
			// 		}
			// 		return res
			// 	})

			// 	setPreviousPost(compulsory_data)
				

			// })
		}

		fetchDaliyTaskBrief()
	}, [])

	// if (isLoading) {
	// 	return <Loading />
	// }
	return (
		<Box classname='page'>
			<Stack direction='column'>
				<Header title='美文广场' />
				<Stack direction='column' sx={{ overflow: 'auto' }}>
					<Sentence content={sentence} />
					{previousPost.map(post => (
						
						<ArticleCard
							id={post.id}
							title={post.title}
							
						/>
					))}
					<Sentence content={encouragingSentence} />
					<Button
						sx={{
							// position: 'absolute',
							m: 2,
							border: '1px dotted black',
							borderRadius: 50,
						}}
						// variant='outlined'
						// startIcon={<StarsIcon />}
						onClick={handleStartClick}
					>
						开始创作！
					</Button>
				</Stack>
			</Stack>
		</Box>
	)
}