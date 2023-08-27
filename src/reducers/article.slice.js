import {createSlice} from '@reduxjs/toolkit'
import {htmlToDelta, parseHtml} from "../pages/studio/helper/parseArticle";
import {v4 as uuidv4} from "uuid";
import { ConstructionOutlined } from '@mui/icons-material';

const htmlString = '<h1>dqwddwqdq<span style="color: rgb(230, 0, 0);">dqwdqdqdqdqwddqw</span></h1><p>dwqdqwddqwd</p><p>dqwdqdqdddd<span style="background-color: rgb(230, 0, 0);">dwqdqdqdd</span><span style="background-color: rgb(230, 0, 0); color: rgb(255, 255, 0);">dqwdqdd</span></p><p><span style="background-color: rgb(230, 0, 0); color: rgb(255, 255, 0);">ddqwdqdqdqd</span></p><p><br></p><p><br></p><p><br></p><p><span style="background-color: rgb(230, 0, 0); color: rgb(255, 255, 0);">dqdqdqd</span></p>';
const tree = parseHtml(htmlString);

const initialState = {
  editingParagraphSentences: [],
  articleWords: [],
  currentArticle: `<p>123</p><p>456</p>`,
  articleContentsTree: [...tree],
  articleContents: [],
  serverURL: "http://10.35.2.78:8000"
}

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {

    insertImage: (state, action) => {
      const {paragraphId, src, fileName} = action.payload;
      let tempArticleContents = [...state.articleContents];
      const paragraphIndex = tempArticleContents.findIndex(item => item.id === paragraphId);
      const html = `<p>
            <img src="${src}" width="100%"/>
      </p>`;
      const delta = htmlToDelta(html);
      if (paragraphIndex !== -1) {
        tempArticleContents = [
          ...tempArticleContents.slice(0, paragraphIndex + 1),
          {
            id: uuidv4(),
            content: html,
            delta,
            contentType: 'image',
            fileName,
          },
          ...tempArticleContents.slice(paragraphIndex + 1)
        ];
        state.articleContents = tempArticleContents;
      }
    },
    insertVideo: (state, action) => {
      const {paragraphId, src} = action.payload;
      let tempArticleContents = [...state.articleContents];
      const paragraphIndex = tempArticleContents.findIndex(item => item.id === paragraphId);
      const html = `<p>
            <video width="100%" controls>
              <source src="${src}">
            </video>
      </p>`;
      const delta = htmlToDelta(html);
      if (paragraphIndex !== -1) {
        tempArticleContents = [
          ...tempArticleContents.slice(0, paragraphIndex + 1),
          {
            id: uuidv4(),
            content: html,
            delta,
            contentType: 'video',
          },
          ...tempArticleContents.slice(paragraphIndex + 1)
        ];
        state.articleContents = tempArticleContents;
      }
    },
    swapParagraph: (state, action) => {
      let tempArticleContents = [...state.articleContents];
      const {oldIndex, newIndex} = action.payload;
      const temp = tempArticleContents[oldIndex];

      tempArticleContents.splice(oldIndex, 1)

      tempArticleContents.splice(newIndex, 0, temp)

      // tempArticleContents[oldIndex] = tempArticleContents[newIndex];
      // tempArticleContents[newIndex] = temp;
      state.articleContents = tempArticleContents;



    },
    addArticleContents: (state, action) => {
      const {content, delta} = action.payload;
      state.articleContents = [...state.articleContents, {
        id: uuidv4(),
        content: content,
        delta: delta,
        contentType: 'text',
      }];
    },
    updateArticleContents: (state, action) => {
      const {paragraphId, paragraph, delta} = action.payload;
      let tempArticleContents = [...state.articleContents];
      console.log(action.payload)
      tempArticleContents = tempArticleContents.map(item => {
        if (item.id === paragraphId) {
          item.content = paragraph;
          item.delta = delta;
        }
        return item;
      });
      state.articleContents = tempArticleContents;
    },
    deleteArticleContents: (state, action) => {
      const {paragraphId} = action.payload;
      state.articleContents = state.articleContents.filter(item => {
        return item.id !== paragraphId;
      })
    },
    setArticleContents: (state, action) => {
      state.articleContents = action.payload;
    },
    setArticleContentTrees: (state, action) => {
      state.articleContentsTree = action.payload;
    },

    updateArticle: (state, action) => {
      state.currentArticle = action.payload;
    },
    updateArticleWords: (state, action) => {
      state.editingParagraphSentences = [...action.payload];
      console.log(state.editingParagraphSentences)
    },
    deleteWord: (state, action) => {
      // let newArticleWords = [...state.articleWords];
      // const {parentId, itemId} = action.payload;
      // if (itemId) {
      //   const list = newArticleWords.find(item => item.id === parentId);
      //   list.words = list.words.filter(word => word.id !== itemId);
      // } else {
      //   newArticleWords = newArticleWords.filter(item => item.id !== parentId);
      // }

      // state.articleWords = newArticleWords;
      let newEditSentences = [...state.editingParagraphSentences]



    },
    updateWord: (state, action) => {
      const newArticleWords = [...state.articleWords];
      const {parentId, itemId, value} = action.payload;

      const list = newArticleWords.find(item => item.id === parentId);
      if (value.trim().length === 0) {
        list.words = list.words.filter(word => word.id !== itemId);
      } else {
        for (let word of list.words) {
          if (word.id === itemId) {
            word.word = value;
            word.editable = false;
          }
        }
      }
      state.articleWords = newArticleWords;
    },
    cancelUpdateWord: (state, action) => {
      const newArticleWords = [...state.articleWords];
      // cancel all item as un editable
      for (let list of newArticleWords) {
        for (let word of list.words) {
          word.editable = false;
        }
      }
      state.articleWords = newArticleWords;
    },
    updateArticleStatusToEditable: (state, action) => {
      const newArticleWords = [...state.articleWords];
      const {parentId, itemId} = action.payload;

      // cancel all item as un editable
      for (let list of newArticleWords) {
        for (let word of list.words) {
          word.editable = false;
        }
      }

      if (!parentId) {
        const item = newArticleWords.find(item => item.id === itemId);
        item.words = item.words.map(item => {
          item.editable = true;
          return item;
        });
      } else {
        const list = newArticleWords.find(item => item.id === parentId);
        const item = list.words.find(item => item.id === itemId);
        item.editable = true;
      }
      state.articleWords = newArticleWords;
    },
    sortArticleWords: (state, action) => {
      const {parentListId, oldIndex, newIndex, paragraphID} = action.payload;
      const newSentenceArr = [...state.editingParagraphSentences];
      console.log([...state.editingParagraphSentences])
      if (!parentListId) {
        const tempItem = newSentenceArr[oldIndex];


        newSentenceArr.splice(oldIndex, 1)

        newSentenceArr.splice(newIndex, 0, tempItem)

        // newSentenceArr[oldIndex] = newSentenceArr[newIndex];
        // newSentenceArr[newIndex] = tempItem;
      } else {
        const list = newSentenceArr.find(item => item.id === parentListId);
        const listWords = list.words;
        const tempItem = listWords[oldIndex];
        listWords[oldIndex] = listWords[newIndex];
        listWords[newIndex] = tempItem;
      }
      state.editingParagraphSentences = [...newSentenceArr];

      // const currentParagraph = state.ar

      console.log("newsentences",newSentenceArr)

      const newParagraph = newSentenceArr.map(el => {
        return el.content
      }).join("")
      
      console.log(newParagraph)

      

      const tempArticleContents = [...state.articleContents].map(item => {
        if (item.id === paragraphID) {
          item.content = newParagraph;
          item.delta = {
            ops:[
              {insert: newParagraph}
            ]
          };
        }
        return item;
      });
      state.articleContents = [...tempArticleContents];

      console.log(state.articleContents)
      console.log(state.editingParagraphSentences)
    }

  },
})
export const {
  setArticleContentTrees,
  updateArticle,
  updateArticleWords,
  sortArticleWords,
  updateArticleStatusToEditable,
  updateWord,
  deleteWord,
  cancelUpdateWord,
  setArticleContents,
  addArticleContents,
  swapParagraph,
  updateArticleContents,
  deleteArticleContents,
  insertImage,
  insertVideo
} = articleSlice.actions

export const articleReducer = articleSlice.reducer;