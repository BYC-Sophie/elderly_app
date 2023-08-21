import { v4 as uuidv4 } from 'uuid';
import {SortableList} from "../components/SortableList";


export const decomposeParagraph = (paragraph) => {
  let words = paragraph.match(/.+?(！|。)/g);
  words = words || [paragraph];
  return words.map(word => {
    return {
      id: uuidv4(),
      word
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