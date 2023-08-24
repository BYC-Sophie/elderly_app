import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {SortableItem} from "../studio/components/SortableItem";
import {Alert, Box, Button, Container, Dialog, Fab, Paper, Typography, Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";

const PreviewPage = () => {

    const articleContents = useSelector(state => state.article.articleContents)
    const navigate = useNavigate()

    console.log(articleContents)

    const handleClickBack = () => {
        navigate(-1)
    }

    return (
        // TODO: 应该可以继续sortable item，把左边的拖拽关了
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
                    <Button variant='contained' onClick={handleClickBack} sx={{ marginRight: '16px' }}>
                        返回
                    </Button>
            </Box>
                <Divider />
        {articleContents.map(paragraph => {
            return (
              <SortableItem
                key={paragraph.id}
                id={paragraph.id}
                border={false}

                contentType={paragraph.contentType}
  
              >
                <div
                  key={paragraph.id}
                  className={'p-4 mt-2 w-100'} >
                  <div
                    style={{
                      wordBreak: 'break-all'
                    }}
                    dangerouslySetInnerHTML={{__html: paragraph.content}}></div>
                </div>
              </SortableItem>
            )
          })}
          </Box>
    );


};

export default PreviewPage;
