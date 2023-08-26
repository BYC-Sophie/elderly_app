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
  updateArticleContents,
  updateArticleStatusToEditable,
  updateArticleWords, updateWord
} from "../../../reducers/article.slice";
import {useEffect, useState, Fragment, useCallback} from "react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {RobotGPT} from "./RobotGPT";
import {MultiMediaMenu} from "./MultiMediaMenu";
import {decomposeParagraph} from "../helper/parseArticle";
import {useQuillEditorContext} from "../../../contexts/QuillEditorContext";

export const ParagraphEdit = ({paragraphID}) => {

  const dispatch = useDispatch();

  const {openQuillEditor} = useQuillEditorContext();

  const [sentenceArr, setSentenceArr] = useState([])

  // const currentArticle = useSelector(state => state.article.currentArticle);
  // const articleWordsInStore = useSelector(state => state.article.articleWords);

  // modified ver
  const articleContents = useSelector(state => state.article.articleContents)
  const currentParagraph = articleContents.find(item => item.id === paragraphID)


  const [editingValue, setEditingValue] = useState('');
  const [openRobot, setOpenRobot] = useState(false);



  const handleDragEnd = (parentListId, itemId, oldIndex, newIndex) => {
    dispatch(sortArticleWords({
      parentListId,
      // itemId,
      oldIndex,
      newIndex,
      paragraphID
    }))

    // const newParaContent = ""
    
    
  }

  const handleClickEdit = (paragraphId, sentenceId) => {
    // dispatch(updateArticleStatusToEditable({
    //   paragraphId,
    //   sentenceId
    // }))
    console.log("DATA HERE")
    console.log(articleContents)
    console.log(currentParagraph)
    console.log(sentenceArr)

    console.log(paragraphId, sentenceId)

    const currentSentence = sentenceArr.find(item => item.id === sentenceId)
    console.log(currentSentence)
    // currentSentence.content = "" // TODO: call quill to edit
    openQuillEditor({
      defaultValue: currentSentence.delta,
      title: '编辑句子',
      onSubmit: (sentence, delta) => {
        const sentenceEl = document.createElement('div')
        sentenceEl.innerHTML = sentence
        
        // Copy currentSentence to replace it in the original paragraph

        let modifiedSentence = {...currentSentence}
        modifiedSentence.content = sentenceEl.textContent

        modifiedSentence.delta = {
          ops: [
            {insert: sentence}
          ]
        }
        
        let modifiedSentenceArr = sentenceArr.map(el => {
          if (el.id === sentenceId){
            el = modifiedSentence
          }
          return el
        })
        
        let modifiedParagraphText = modifiedSentenceArr.map(el => {
          return el.content
        }).join("")


        console.log(modifiedParagraphText)
        console.log(articleContents)        

        setSentenceArr(modifiedSentenceArr)

        dispatch(updateArticleContents({
          paragraphId,
          paragraph: modifiedParagraphText,
          delta: {
            ops: [
              {insert: modifiedParagraphText.content}
            ]
          }
          
        }))
      }
    })


  }

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
    
    const newParagraphSentences = decomposeParagraph(currentParagraph.content);

    setSentenceArr([...newParagraphSentences])

    dispatch(updateArticleWords(newParagraphSentences));
  }, []);

  // useEffect(() => {
  //   setParagraphSentences(articleWordsInStore);
  // }, [articleWordsInStore]);

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
        {sentenceArr.map(sentenceItem => {
          return (
              <SortableItem
                border={false}
                onClickEdit={() => {
                  handleClickEdit(paragraphID, sentenceItem.id);
                }}
                onClickDelete={() => {
                  handleClickDelete(paragraphID, sentenceItem.id)
                }}
                onClickReGenerate={() => {
                  // handleClickEdit(sentenceItem.id, word.id);
                  // setEditingValue(word.word);
                  // setOpenRobot(true);
                }}
                id={sentenceItem.id} 
                contentType={"text"}
                MorevertDistanceBool={true}
                >
                  <Box
                    sx={{
                      border: "ridge",
                      borderRadius: "5px",
                      padding: "5px",
                    }}
                  >
                    <div
                      style={{
                        wordBreak: 'break-all'
                      }}
                      // dangerouslySetInnerHTML={{__html: sentenceItem.content}}>
                      >
                        {sentenceItem.content}
                    </div>
                  </Box>
                {/* { word.editable ? (
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
                              handleClickEditSubmit(sentenceItem.id, word.id)
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
                    defaultValue={word.word}/>) : <span>{word.word}</span>} */}
              </SortableItem>
          )
        })}
      </SortableList>
    </Container>
  )
}