import {Alert, Box, Button, Container, Dialog, Fab, Paper} from "@mui/material";
import {ArticleEdit} from "./components/ArticleEdit";
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
  updateArticleContents
} from "../../reducers/article.slice";
import {SortableList} from "./components/SortableList";
import {SortableItem} from "./components/SortableItem";
import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {MultiMediaMenu} from "./components/MultiMediaMenu";
import {useQuillEditorContext} from "../../contexts/QuillEditorContext";
import {RobotGPT} from "./components/RobotGPT";
import {htmlToDelta} from "./helper/parseArticle";
export default function Studio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openRobot, setOpenRobot] = useState(false);

  const articleContents = useSelector(state => state.article.articleContents);
  const [editingParagraph, setEditingParagraph] = useState(null);
  const {openQuillEditor} = useQuillEditorContext();

  const handleClickEdit = useCallback((paragraphId) => {
    const articleContent = articleContents.find(item => item.id === paragraphId);
    if (articleContent) {
      openQuillEditor({
        defaultValue: articleContent.delta,
        title: '编辑段落',
        onSubmit: (paragraph, delta) => {
          dispatch(updateArticleContents({
            paragraphId,
            paragraph,
            delta
          }))
        }
      })
    }
  }, [articleContents]);

  const handleClickOpenEditor = () => {
    openQuillEditor({
      title: '创建段落',
      onSubmit: (paragraph, delta) => {
        dispatch(addArticleContents({
          content: paragraph,
          delta
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
      dispatch(swapParagraph(oldIndex, newIndex));
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

  const handleSelectImage = async (paragraph, src) => {
    dispatch(insertImage({
      paragraphId: paragraph.id,
      src
    }))
  }

  return (
    <Box paddingBottom={'50px'}>

      <RobotGPT
        html={editingParagraph?.content || ''}
        onSubmit={handleGPTSubmit}
        editingWord={''}
        open={openRobot}
        onClose={() => {
          setOpenRobot(false)
        }}
      />
      <Alert style={{
        marginTop: '30px'
      }} severity="warning">
        您还没有创建段落！点击下面的按钮即可创建。
      </Alert>
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
              key={paragraph.id}
              id={paragraph.id}
              border={false}
              endComponent={(
                <Box textAlign={'center'} marginTop={'10px'}>
                  <MultiMediaMenu
                    onSelectImage={(src) => {
                      handleSelectImage(paragraph, src);
                    }}
                  />
                </Box>
              )}
            >
              <div
                key={paragraph.id}
                className={'p-2 mt-2 w-100'} >
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