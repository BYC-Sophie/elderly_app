import SortableItemStyle from './SortableItem.module.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useRef, useState} from "react";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import PsychologyIcon from '@mui/icons-material/Psychology';
export const SortableItem = (
  {
    children,
    id,
    onClickEdit,
    onClickDelete,
    onClickReGenerate,
    onClickGenerate,
    border=true,
    endComponent,
    contentType,
    MorevertDistanceBool,
  }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const moreVertStyle = MorevertDistanceBool ? {left: '-20px !important', display: 'none !important'} : {left: '-10px'}
  const handleClickEdit = () => {
    if (onClickEdit) {
      onClickEdit();
      setAnchorEl(null);
    }
  }

  const handleClickDelete = () => {
    if (onClickDelete) {
      onClickDelete();
      setAnchorEl(null);
    }
  }

  const handleClickGenerate = () => {
    if(contentType === 'image' && onClickGenerate) {
      onClickGenerate();
      setAnchorEl(null);
    }
  }

  const handleClickReGenerate = () => {
    if (contentType === 'text' && onClickReGenerate) {
      onClickReGenerate();
      setAnchorEl(null);
    }
  }

  return (
    <li id={id} role={'button'}
        className={`list-group-item d-flex flex-wrap ${SortableItemStyle.sortItem} ${border ? 'border border-1' : 'border-0'}`}>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        {contentType === 'text' && (
          <MenuItem
            onClick={handleClickEdit}
            style={{
            width: '200px'
          }}>
            <ListItemIcon>
              <EditIcon fontSize={'small'}/>
            </ListItemIcon>
            <ListItemText>
              编辑
            </ListItemText>
          </MenuItem>
        )}
        

        <MenuItem
          onClick={handleClickDelete}
        >
          <ListItemIcon>
            <DeleteForeverIcon fontSize={'small'}/>
          </ListItemIcon>
          <ListItemText>
            删除
          </ListItemText>
        </MenuItem>

        {contentType === 'text' && (
          <MenuItem
            onClick={handleClickReGenerate}
          >
            <ListItemIcon>
              <PsychologyIcon />
            </ListItemIcon>
            <ListItemText>
              智能修改
            </ListItemText>
          </MenuItem>
        )}

        {contentType === 'image' && (
          <MenuItem onClick={handleClickGenerate}>
            <ListItemIcon>
              <PsychologyIcon />
            </ListItemIcon>
            <ListItemText>
              文字生成
            </ListItemText>
          </MenuItem>
        )}


        

      </Menu>


      {/* <div className={`w-100 ${SortableItemStyle.content}`}> */}
      <div className={`w-100 ${SortableItemStyle.content}`} onClick={e => {
        setAnchorEl(e.currentTarget)
      }}>
        {(!MorevertDistanceBool && <MoreVertIcon
          onClick={e => {
            setAnchorEl(e.currentTarget);
          }}
          className={[SortableItemStyle.menuIcon, "drag-handle"].join(" ")} sx={moreVertStyle} />)}
        
        {children}
      </div>

      <div className={'w-100'}>
        {endComponent}
      </div>
    </li>
  )
}