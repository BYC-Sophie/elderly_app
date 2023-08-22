// import {Box, Card, CardContent, Paper} from "@mui/material";


// export default function Posts() {
//   return (
//     <Box>
//       <Card
//         component={Paper} elevation={2}>
//         <CardContent>
//           用户的文章1
//         </CardContent>
//       </Card>
//       <Card
//         style={{
//           marginTop: '20px'
//         }}
//         component={Paper} elevation={2}>
//         <CardContent>
//           用户的文章2
//         </CardContent>
//       </Card>
//     </Box>
//   )
// }
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Divider, Stack } from '@mui/material'
import Header from '../../../Components/Header'
import {Document} from "react-pdf"

function Article() {
  const { id } = useParams(); // 获取路由参数中的文章 ID
  const navigate = useNavigate(); // 获取 navigate 函数

  // 假设这是一个包含文章内容的数据
  const articles = [
    {
      id: 1,
      title: '第一篇文章',
      content: '这是第一篇文章的内容。',
    },
    {
      id: 2,
      title: '第二篇文章',
      content: '这是第二篇文章的内容。',
    },
  ];

  // 根据文章 ID 查找对应的文章
  const article = articles.find(article => article.id.toString() === id);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  if (!article) {
    return (
        <div>
            <div>文章不存在。</div>
            <button onClick={handleGoBack}>返回</button>
        </div>
    )
  }

  

  return (
    <Box classname='page'>
			<div>
        <div>
          {/* <Document file="test1.pdf"/> */}
        </div>
        <Button
              sx={{
                // position: 'absolute',
                m: 2,
                border: '1px dotted black',
                borderRadius: 50,
              }}
              // variant='outlined'
              // startIcon={<StarsIcon />}
              onClick={handleGoBack}
          >
            返回
          </Button>
      </div>
		</Box>
    
  );
}

export default Article;
