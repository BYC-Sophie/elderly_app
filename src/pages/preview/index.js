import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {SortableItem} from "../studio/components/SortableItem";
import {Alert, Box, Button, Container, Dialog, Fab, Paper, Typography, Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";

const PreviewPage = () => {

    const articleContents = useSelector(state => state.article.articleContents)
    const navigate = useNavigate()

    const handleClickBack = () => {
        navigate(-1)
    }

    const handleClickDownload = () => {
        navigate('/download')
    }

    const handleClickTemplate = () => {}
        // 不做了这个功能
    return (
        <Box paddingBottom={'50px'}>
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
                        预览
                    </Typography>
                    <Box>
                        <Button variant='contained' color='success' onClick={handleClickDownload} sx={{ marginRight: '16px' }}>
                            下载
                        </Button>
                        {/* <Button variant='contained' color='success' onClick={handleClickTemplate} sx={{ marginRight: '16px' }}>
                            模板/音乐
                        </Button> */}
                        <Button variant='contained' onClick={handleClickBack} sx={{ marginRight: '16px' }}>
                            返回
                        </Button>
                    </Box>
                    
            </Box>
                <Divider />
        {articleContents.map(paragraph => {
            return (
                <div
                  key={paragraph.id}
                  className={'p-4 mt-2 w-100'} >
                  <div
                    style={{
                      wordBreak: 'break-all'
                    }}
                    dangerouslySetInnerHTML={{__html: paragraph.content}}></div>
                </div>  
            )
          })}
          </Box>
    );


};

export default PreviewPage;
