// import {Sortable} from 'sortablejs/modular/sortable.complete.esm.js';
import {useEffect, useRef} from "react";

import { Sortable,  AutoScroll} from 'sortablejs/modular/sortable.core.esm';

Sortable.mount(new AutoScroll());

export const SortableList = (
  {
    children,
    direction = 'vertical',
    onDragEnd,
    border = false,
    id,
    ...props
  }) => {
  const listRef = useRef();

  useEffect(() => {
    if (listRef.current) {
      new Sortable(listRef.current, {
        animation: 150,
        handle: ".drag-handle",
        scroll: true,
        scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
	      scrollSpeed: 20,
        onEnd: (e) => {
          if (typeof onDragEnd === 'function') {
            onDragEnd(e.oldIndex, e.newIndex, e.item.id, id);
          }
        }
      })
    }
  }, [listRef]);

  return (
    <ul ref={listRef} className={`flex-wrap p-2 list-group  
      ${border ? 'border border-1' : ''}
    ${direction === 'horizon' ? 'flex-row' : 'flex-column' }`} {...props}>
      {children}
    </ul>
  )
}