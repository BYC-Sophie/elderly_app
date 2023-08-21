import ChatBoxStyle from './ChatBox.module.css';
import {Box} from "@mui/material";
export const ChatBox = ({children, message}) => {
  return (
    <Box className={ChatBoxStyle.wrapper}>
      {children}
      <Box className={ChatBoxStyle.chatBox}>
        {message}
      </Box>
    </Box>
  )
}