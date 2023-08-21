import AddIcon from '@mui/icons-material/Add';
import {Box, Fab, IconButton, Popover, Stack} from "@mui/material";
import {useState} from "react";
import ImageIcon from '@mui/icons-material/Image';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import TitleIcon from '@mui/icons-material/Title';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {convertImageToBase64} from "../helper/parseArticle";
export const MultiMediaMenu = ({onSelectImage}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSelectImage = async (e) => {
    const file = e.target.files[0];
    const src = await convertImageToBase64(file);
    onSelectImage && onSelectImage(src);
    setAnchorEl(null);
  }

  return (
    <>
      <Fab
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        color={'info'} size={'small'}>
        <AddIcon />
      </Fab>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        open={Boolean(anchorEl)}>
        <Stack direction={'row'} spacing={2} className={'p-2 d-flex'}>
          <IconButton component={"label"}>
            <ImageIcon />
            <input
              onChange={handleSelectImage}
              type={'file'} hidden/>
          </IconButton>
          <IconButton>
            <FormatColorTextIcon />
          </IconButton>
          <IconButton>
            <TitleIcon />
          </IconButton>
          <IconButton>
            <PlayCircleIcon />
          </IconButton>
        </Stack>
      </Popover>
    </>
  )
}