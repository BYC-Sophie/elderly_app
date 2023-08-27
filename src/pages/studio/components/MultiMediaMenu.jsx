import AddIcon from '@mui/icons-material/Add';
import {Box, Fab, IconButton, Popover, Stack, ListItemText} from "@mui/material";
import {useState} from "react";
import ImageIcon from '@mui/icons-material/Image';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import TitleIcon from '@mui/icons-material/Title';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {convertImageToBase64} from "../helper/parseArticle";
import axios from 'axios';
import { useSelector } from 'react-redux';

export const MultiMediaMenu = ({onSelectImage, onSelectVideo}) => {

  const serverURL = useSelector(state => state.article.serverURL)
  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleSelectImage = async (e) => {
    
    const file = e.target.files[0];
    setSelectedImage(file);

    const src = URL.createObjectURL(file);
    
    

    // Save img to the server
    const formData = new FormData();
    formData.append('image', file);
    let fileName = ''
    try {
        const response = await axios.post(`${serverURL}/apis/saveImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(response && response.data){
        fileName = response.data['fileName']
      }
      
      console.log('Image uploaded successfully', fileName);



    } catch (error) {
      console.error('Error uploading image', error);
    }
    onSelectImage && onSelectImage(src, fileName);
    setAnchorEl(null);
  }

  const handleSelectVideo = async (e) => {
    const file = e.target.files[0]
    const src = URL.createObjectURL(file)

    console.log(src)
    onSelectVideo && onSelectVideo(src)
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
        <Stack direction={'column'} className={'p-2 d-flex'}>
          <IconButton component={"label"} >
            <ImageIcon />
            <input
              onChange={handleSelectImage}
              type={'file'} accept='image/*' hidden/>
          <ListItemText primary="图片" className='mx-2'/>
          </IconButton>
          
          <IconButton >
            <FormatColorTextIcon />
            <ListItemText primary="文字" className='mx-2'/>
          </IconButton>
          {/* <IconButton>
            <TitleIcon />
          </IconButton> */}
          <IconButton component={"label"}>
            <PlayCircleIcon />
            <input
              onChange={handleSelectVideo}
              type={'file'} accept='video/*' hidden/>
          <ListItemText primary="视频" className='mx-2'/>
          </IconButton>
        </Stack>

      </Popover>
    </>
  )
}