import AddIcon from "@mui/icons-material/Add";
import {Box, Button, Dialog, DialogContent, DialogTitle, Fab} from "@mui/material";
import {useEffect, useLayoutEffect, useState} from "react";

import QuillEditor from "../../../components/QuillEditor";


export default function CreateParagraph({onSubmit}) {
  const [open, setOpen] = useState(false);
  const [paragraph, setParagraph] = useState('');

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = () => {
    onSubmit && onSubmit(paragraph);
    setOpen(false);
  }


  return (
    <>
      <Dialog fullWidth open={open} onClose={() => {
        handleClose();
      }}>
        <DialogTitle>
          创建段落
        </DialogTitle>
        <DialogContent>
          <QuillEditor
            onChange={setParagraph}
          />
          <Box marginTop={'30px'} className={'d-flex justify-content-between align-items-center'}>
            <Button
              onClick={handleSubmit}
              variant={'contained'}>创建</Button>
            <Button
              onClick={handleClose}
              variant={'contained'} color={'inherit'}>取消</Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Fab
        onClick={() => {
          setOpen(true)
        }}
        color={'primary'}>
        <AddIcon />
      </Fab>
    </>
  )
}