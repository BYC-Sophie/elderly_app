import {useQuill} from "react-quilljs";
import {useEffect} from "react";

export default function QuillEditor({onChange, defaultDelta}) {

  const toolbarOptions = [
    ['bold'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
  ];
  const { quill, quillRef  } = useQuill({

    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'
  });


  useEffect(() => {
    if (quill) {
      if (defaultDelta) {
        quill.setContents(defaultDelta);
      }
      quill.on('text-change', () => {
        onChange && onChange(quill.root.innerHTML, quill.getContents());
      })
    }
  }, [quill]);

  return (
    <div ref={quillRef} style={{
      height: 300
    }}>

    </div>
  )
}