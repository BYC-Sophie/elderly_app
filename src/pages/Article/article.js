import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Button, Divider, Stack } from '@mui/material'
import Header from '../../Components/Header'
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import './article.css'
import PDF1 from './userWritings/writing1.pdf'
import PDF2 from './userWritings/writing2.pdf'


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function Article() {
  const { id } = useParams(); // 获取路由参数中的文章 ID
  const navigate = useNavigate(); // 获取 navigate 函数
  const [numPages, setNumPages] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  

  // 假设这是一个包含文章内容的数据
  const articles = [
    {
      id: 1,
      title: '第一篇文章',
      content: PDF1,
    },
    {
      id: 2,
      title: '第二篇文章',
      content: PDF2,
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
    <Box className='page' sx={{width: "100vw"}}>
			<Stack direction='column'>
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
        <Box>
          <Document file={article.content} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber}/>
          </Document>
        </Box>

      </Stack>
		</Box>
    
  );
}

export default Article;
