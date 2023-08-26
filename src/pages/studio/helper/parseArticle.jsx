import { v4 as uuidv4 } from 'uuid';
import {SortableList} from "../components/SortableList";
import * as htmlparser2 from "htmlparser2";

import Quill from 'quill';
/**
 * 将html字符串转成delta
 * @param {*} html
 * @returns delta json
 */
export function htmlToDelta(html) {
  const div = document.createElement('div');
  div.setAttribute('id', 'htmlToDelta');
  div.innerHTML = `<div id="quillEditor" style="display:none">${html}</div>`;
  document.body.appendChild(div);
  const quill = new Quill('#quillEditor', {
    theme: 'snow',
  });
  const delta = quill.getContents();
  document.getElementById('htmlToDelta').remove();
  return delta;
}
export function parseHtml(htmlStr) {

  let elements = [];
  let stack = [];
  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      let currentTag = {
        id: uuidv4(),
        name,
        children: [],
        attributes,
        type: 'tag'
      }
      stack.push(currentTag);
    },
    ontext(text) {
      const element = stack.pop();
      const attributes = [];
      for (let attributeName in element.attributes) {
        attributes.push(`${attributeName}='${element.attributes[attributeName]}'`);
      }
      element.children.push({
        id: uuidv4(),
        type: 'text',
        renderHTML: `<${element.name} ${attributes.join(' ')}>${text}</${element.name}>`,
        content: text,
        children: []
      })
      stack.push(element);
    },
    onclosetag(tagname) {
      let tag = stack.pop();
      let parent = stack.pop();
      if (parent) {
        parent.children.push(tag);
        stack.push(parent)
      } else {
        elements.push(tag);
      }
    }
  });

  parser.write(htmlStr);
  parser.end();

  return elements;
}
export const decomposeParagraph = (paragraph) => {
  console.log(paragraph)
  let words = paragraph.match(/.+?(！|。)/g);
  words = words || [paragraph];
  return words.map(word => {
    return {
      id: uuidv4(),
      content: word,
      delta: {
        ops: [
          {insert: word}
        ]
      }
    }
  });
}
export const decomposeArticle = (article) => {
  const parser = new DOMParser();

  const parsedHtml = parser.parseFromString(article, 'text/html');

  const pTags = parsedHtml.querySelectorAll('p');

  const pContents = Array.from(pTags).map(pTag => pTag.textContent.trim());

  return pContents.map(content => {
    return {
      words: decomposeParagraph(content),
      id: uuidv4()
    }
  });
}

export const parseArticle = (article) => {
  const parser = new DOMParser();

  const parsedHtml = parser.parseFromString(article, 'text/html');

  const pTags = parsedHtml.querySelectorAll('p');

  const pContents = Array.from(pTags).map(pTag => pTag.textContent.trim());
  return pContents;
}

export function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(event) {
      const base64String = event.target.result;
      resolve(base64String);
    };

    reader.onerror = function(error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}



export const generateSortableList = (explodedArticleArray) => {
  const list = [];
  for (let paragraph of explodedArticleArray) {
    const wordList = [];
    let words = paragraph.match(/.+?(，|。|！)/g);
    words = words || [paragraph];
    for (let word of words) {
      wordList.push(
        <li
          key={uuidv4()}
          className={'list-group-item border-1 border'} role={'button'}>
          {word}
        </li>
      )
    }
    list.push(
      <li key={uuidv4()} className={'list-group-item border-1 border'} role={'button'}>
        <SortableList

          direction={'horizon'}>
          {wordList}
        </SortableList>
      </li>
    )
  }
  return (
    <SortableList>
      {list}
    </SortableList>
  )
}