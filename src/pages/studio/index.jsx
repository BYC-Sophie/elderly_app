import {Alert, Box, Button, Container, Dialog, Fab, Paper, Typography, Divider} from "@mui/material";
// import {ArticleEdit} from "./components/ArticleEdit";
import { ParagraphEdit } from "./components/ParagraphEdit";
import { v4 as uuidv4 } from 'uuid';
import 'quill/dist/quill.snow.css';
import { useQuill } from 'react-quilljs';
import AddIcon from '@mui/icons-material/Add';
import CreateParagraph from "./components/CreateParagraph";
import {useDispatch, useSelector} from "react-redux";
import {
  addArticleContents,
  deleteArticleContents, insertImage,
  sortArticleWords,
  swapParagraph,
  updateArticleContents,
  insertVideo
} from "../../reducers/article.slice";
import {SortableList} from "./components/SortableList";
import {SortableItem} from "./components/SortableItem";
import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {MultiMediaMenu} from "./components/MultiMediaMenu";
import {useQuillEditorContext} from "../../contexts/QuillEditorContext";
import {RobotGPT} from "./components/RobotGPT";
import {ImageGPT} from "./components/Image2TextGPT"

import {htmlToDelta} from "./helper/parseArticle";
export default function Studio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openRobot, setOpenRobot] = useState(false);
  const [openImageBot, setOpenImageBot] = useState(false);

  const articleContents = useSelector(state => state.article.articleContents);
  const [editingParagraph, setEditingParagraph] = useState(null);
  const {openQuillEditor} = useQuillEditorContext();

  const handleClickPreview = () => {
    navigate('/preview')
  }
  // TODO: 这里要改成按句子分block的形式
  // const handleClickEdit = useCallback((paragraphId) => {
  //   const articleContent = articleContents.find(item => item.id === paragraphId);
  //   if (articleContent) {
  //     let tempDelta = articleContent.delta
  //     if(! articleContent.delta){
  //       tempDelta = {
  //         ops: [
  //           {insert: articleContent.content}
  //         ]
  //       }
  //     }
  //     openQuillEditor({
  //       defaultValue: tempDelta,
  //       title: '编辑段落',
  //       onSubmit: (paragraph, delta) => {
  //         dispatch(updateArticleContents({
  //           paragraphId,
  //           paragraph,
  //           delta
  //         }))
  //       }
  //     })
  //   }
  // }, [articleContents]);

  const [sentenceDialogOpen, setSentenceDialogOpen] = useState(false)
  const [currentParagraphID, setCurrentParagraphID] = useState(null)
  const handleCloseSentenceDialog = () => {
    setSentenceDialogOpen(false)
  }

  const handleClickEdit = useCallback ((paragraphId) => {
    const articleContent = articleContents.find(item => item.id === paragraphId)
    setCurrentParagraphID(paragraphId)
    setSentenceDialogOpen(true)

  }, [articleContents])

  const handleClickOpenEditor = () => {
    openQuillEditor({
      title: '创建段落',
      onSubmit: (paragraph, delta) => {
        const paragraphEl = document.createElement('div');
        paragraphEl.innerHTML = paragraph
        const pureText = paragraphEl.querySelector('p').textContent

        dispatch(addArticleContents({
          content: pureText,
          delta: {
            ops: [
              {insert: pureText}
            ]
          }
        }));
      }
    })
  }

  const handleClickDelete = (paragraphId) => {
    dispatch(deleteArticleContents({
      paragraphId
    }))
  }

  const handleDragEnd = (parentListId, itemId, oldIndex, newIndex) => {
    if (oldIndex !== newIndex) {
      dispatch(swapParagraph({oldIndex, newIndex}));
    }


  }

  const handleGPTSubmit = (paragraph) => {
    const delta = htmlToDelta(paragraph);
    dispatch(updateArticleContents({
      paragraphId: editingParagraph.id,
      paragraph: paragraph,
      delta
    }));
    setEditingParagraph(null);
    setOpenRobot(false);
  }

  const handleImageGPTSubmit = (paragraph) => {
    dispatch(addArticleContents({
      content: paragraph,
      delta: {
        ops: [
          {insert: paragraph}
        ]
      }
    }))
    setEditingParagraph(null)
    setOpenImageBot(false)
  }

  const handleSelectImage = async (paragraph, src, fileName) => {
    dispatch(insertImage({
      paragraphId: paragraph.id,
      src,
      fileName
    }))
  }

  const handleSelectVideo = async (paragraph, src) => {
    // TODO: add video
    dispatch(insertVideo({
      paragraphId: paragraph.id,
      src
    }))
  }


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
						编辑
					</Typography>
					<Button variant='contained' onClick={handleClickPreview} sx={{ marginRight: '16px' }}>
						预览
					</Button>
			</Box>
			  <Divider />
      <RobotGPT
        html={editingParagraph?.content || ''}
        onSubmit={handleGPTSubmit}
        editingWord={''}
        open={openRobot}
        onClose={() => {
          setOpenRobot(false)
        }}
      />

      <ImageGPT
        html={editingParagraph?.content || ''}
        onSubmit={handleImageGPTSubmit}
        open={openImageBot}
        onClose={() => {
          setOpenImageBot(false)
        }}
        imgFileName={editingParagraph?.contentType === 'image' ? editingParagraph?.fileName : null}
        
      />


      {/* 单段句子修改 */}

      <Dialog
        open={sentenceDialogOpen}
        onClose={handleCloseSentenceDialog}
      >
        <ParagraphEdit
          paragraphID={currentParagraphID}
        />
      </Dialog>

      {/* <Alert style={{
        marginTop: '30px'
      }} severity="warning">
        您还没有创建段落！点击下面的按钮即可创建。
      </Alert> */}
      <Box textAlign={'center'} marginTop={'30px'}>
        <Button
          onClick={handleClickOpenEditor}
          variant={'contained'}>
          创建段落
        </Button>
      </Box>
      <SortableList
        onDragEnd={(oldIndex, newIndex, itemId, parentId) => {
          handleDragEnd(
            parentId,
            itemId,
            oldIndex,
            newIndex
          )
        }}
      >
        {articleContents.map(paragraph => {
          return (
            <SortableItem
              onClickDelete={() => {
                handleClickDelete(paragraph.id)
              }}
              onClickEdit={() => {
                handleClickEdit(paragraph.id)
              }}
              onClickReGenerate={() => {
                setEditingParagraph(paragraph);
                setOpenRobot(true);
              }}
              onClickGenerate={() => {
                // TODO: Image captioning and chat
                setEditingParagraph(paragraph)
                setOpenImageBot(true);
              }}
              key={paragraph.id}
              id={paragraph.id}
              border={false}
              endComponent={(
                <Box textAlign={'center'} marginTop={'10px'}>
                  <MultiMediaMenu
                    onSelectImage={(src, fileName) => {
                      handleSelectImage(paragraph, src, fileName);
                    }}
                    onSelectVideo={(src) => {
                      handleSelectVideo(paragraph, src)
                    }}
                  />
                </Box>
              )}
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
      </SortableList>


      <Box textAlign={'center'} marginTop={'60px'}>
        <Button
          onClick={() => {
            navigate('/chat-gpt')
          }}>
          和智能助手聊聊
        </Button>
      </Box>

    </Box>
  )
}