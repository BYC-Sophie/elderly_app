import {Box, Container, IconButton, Stack, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {SortableList} from "./SortableList";

import {SortableItem} from "./SortableItem";
import { v4 as uuidv4 } from 'uuid';
import {
  cancelUpdateWord,
  deleteWord,
  sortArticleWords,
  updateArticle,
  updateArticleStatusToEditable,
  updateArticleWords, updateWord
} from "../../../reducers/article.slice";
import {useEffect, useState, Fragment} from "react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {RobotGPT} from "./RobotGPT";
import {MultiMediaMenu} from "./MultiMediaMenu";
import {decomposeArticle} from "../helper/parseArticle";
export const ArticleEdit = () => {

  const dispatch = useDispatch();

  const articleContentTree = useSelector(state => state.article.articleContentsTree);


  const [articleWords, setArticleWords] = useState([]);
  const currentArticle = useSelector(state => state.article.currentArticle);
  const articleWordsInStore = useSelector(state => state.article.articleWords);


  const [editingValue, setEditingValue] = useState('');
  const [openRobot, setOpenRobot] = useState(false);



  const handleDragEnd = (parentListId, itemId, oldIndex, newIndex) => {
    dispatch(sortArticleWords({
      parentListId,
      itemId,
      oldIndex,
      newIndex
    }))
  }

  const handleClickEdit = (parentId, itemId) => {
    dispatch(updateArticleStatusToEditable({
      parentId,
      itemId
    }))
  }

  const handleClickEditSubmit = (parentId, itemId) => {
    dispatch(updateWord({
      parentId,
      itemId,
      value: editingValue
    }));
  }

  const handleClickEditCancel = () => {
    dispatch(cancelUpdateWord());
  }

  const handleClickDelete = (parentId, itemId) => {
    dispatch(deleteWord({
      parentId,
      itemId
    }))
  }

  const handleGPTSubmit = (newWord) => {
    setOpenRobot(false);
    setEditingValue(newWord);
  }

  useEffect(() => {
    const newArticleWords = decomposeArticle(currentArticle);
    setArticleWords(newArticleWords);
    dispatch(updateArticleWords(newArticleWords));
  }, []);

  useEffect(() => {
    setArticleWords(articleWordsInStore);
  }, [articleWordsInStore]);

  return (
    <Container>

      <RobotGPT
        onSubmit={handleGPTSubmit}
        editingWord={editingValue}
        open={openRobot}
        onClose={() => {
          setOpenRobot(false)
        }}
      />

      {/*<SortableList>*/}
      {/*  {articleContentTree.map(item => {*/}
      {/*    return (*/}
      {/*      <SortableItem*/}
      {/*        key={item.id}*/}
      {/*        id={item.id}*/}
      {/*        border={false}>*/}
      {/*        <SortableList*/}
      {/*          border={true}*/}
      {/*          id={item.id}*/}
      {/*          direction={'horizon'}*/}
      {/*        >*/}
      {/*          {item.children.map(child => {*/}
      {/*            let html = child.renderHTML;*/}
      {/*            if (!html && child.children.length > 0) {*/}
      {/*              html = child.children[0].renderHTML;*/}
      {/*            }*/}
      {/*            return (*/}
      {/*              <SortableItem*/}
      {/*                border={false}*/}
      {/*                id={child.id}*/}
      {/*                key={child.key}*/}
      {/*              >*/}
      {/*               <div dangerouslySetInnerHTML={{*/}
      {/*                 __html: html*/}
      {/*               }}></div>*/}
      {/*              </SortableItem>*/}
      {/*            )*/}
      {/*          })}*/}
      {/*        </SortableList>*/}

      {/*      </SortableItem>*/}
      {/*    )*/}
      {/*  })}*/}
      {/*</SortableList>*/}

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
        {articleWords.map(articleWordsItem => {
          return (
            <SortableItem
              border={false}
              onClickDelete={() => {
                handleClickDelete(articleWordsItem.id)
              }}
              endComponent={(
                <Box textAlign={'center'} marginTop={'10px'}>
                  <MultiMediaMenu />
                </Box>
              )}
              id={articleWordsItem.id}
              key={articleWordsItem.id}>
              <SortableList
                border={true}
                onDragEnd={(oldIndex, newIndex, itemId, parentId) => {
                  handleDragEnd(
                    parentId,
                    itemId,
                    oldIndex,
                    newIndex
                  )
                }}
                id={articleWordsItem.id}
                direction={'horizon'}>
                {articleWordsItem.words.map(word => {
                  return (
                    <SortableItem
                      border={false}
                      onClickEdit={() => {
                        handleClickEdit(articleWordsItem.id, word.id);
                        setEditingValue(word.word);
                      }}
                      onClickDelete={() => {
                        handleClickDelete(articleWordsItem.id, word.id)
                      }}
                      onClickReGenerate={() => {
                        handleClickEdit(articleWordsItem.id, word.id);
                        setEditingValue(word.word);
                        setOpenRobot(true);
                      }}
                      id={word.id} key={word.id}>
                      { word.editable ? (
                        <TextField
                          style={{
                            width: '100%'
                          }}
                          value={editingValue}
                          onChange={e => {
                            setEditingValue(e.target.value)
                          }}
                          size={'small'}
                          InputProps={{
                            endAdornment: (
                              <Stack direction={'row'}>
                                <IconButton
                                  onClick={() => {
                                    handleClickEditSubmit(articleWordsItem.id, word.id)
                                  }}
                                  color={'success'}>
                                  <CheckIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    handleClickEditCancel();
                                  }}
                                >
                                  <CloseIcon color={'error'}/>
                                </IconButton>
                              </Stack>
                            )
                          }}
                          defaultValue={word.word}/>) : <span>{word.word}</span>}
                    </SortableItem>
                  )
                })}
              </SortableList>
            </SortableItem>
          )
        })}
      </SortableList>
    </Container>
  )
}