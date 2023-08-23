import {createContext, useContext, useEffect, useState} from "react";
import {Box, Button, Dialog, DialogContent, DialogTitle} from "@mui/material";
import QuillEditor from "../Components/QuillEditor";


const QuillEditorContext = createContext(null);

const useQuillEditor = () => {
  const [open, setOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState();
  const [title, setTitle] = useState('');

  const [events, setEvents] = useState({
    onSubmit: null,
    onClose: null
  });

  const openQuillEditor = (
    {
      defaultValue,
      onSubmit,
      onClose,
      title
    }
  ) => {
    setTitle(title);
    setEvents({
      onSubmit,
      onClose
    });
    if (defaultValue) {
      setDefaultValue(defaultValue);
    }
    setOpen(true);
  }

  const closeQuillEditor = () => {
    setOpen(false);
    setDefaultValue(null);
    setEvents({
      onSubmit: null,
      onClose: null
    })
  }

  return {
    open,
    openQuillEditor,
    closeQuillEditor,
    defaultValue,
    events,
    title
  }
}

export const QuillEditorProvider = ({children}) => {
  const data = useQuillEditor();
  const {open, closeQuillEditor, events, defaultValue, title} = data;
  const [paragraph, setParagraph] = useState('');
  const [delta, setDelta] = useState(null);
  const handleClose = () => {
    closeQuillEditor();
  }

  const handleSubmit = () => {
    events && events.onSubmit && events.onSubmit(paragraph, delta);
    console.log(delta)
    closeQuillEditor();

  }

  useEffect(() => {
    if (!open) {
      events && events.onClose && events.onClose();
    }
  }, [open]);

  return (
    <QuillEditorContext.Provider value={data}>
      <Dialog fullWidth open={open} onClose={() => {
        handleClose();
      }}>
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <QuillEditor
            defaultDelta={defaultValue}
            onChange={(paragraph, delta) => {
              setParagraph(paragraph);
              setDelta(delta);
            }}
          />
          <Box marginTop={'30px'} className={'d-flex justify-content-between align-items-center'}>
            <Button
              onClick={handleSubmit}
              variant={'contained'}>提交</Button>
            <Button
              onClick={handleClose}
              variant={'contained'} color={'inherit'}>取消</Button>
          </Box>
        </DialogContent>
      </Dialog>
      {children}
    </QuillEditorContext.Provider>
  )
}


export const useQuillEditorContext = () => {
  return useContext(QuillEditorContext);
}