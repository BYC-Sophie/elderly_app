import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {SortableItem} from "../studio/components/SortableItem";
import {Alert, Box, Button, Container, Dialog, Fab, Paper, Typography, Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";

const PreviewPage = () => {

    const articleContents = useSelector(state => state.article.articleContents)


    return (
        <Box>
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
