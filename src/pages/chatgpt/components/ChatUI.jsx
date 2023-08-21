import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import RobotIcon from '../../../assets/images/robot.png';
import Sending from "./Sending";
import { v4 as uuidv4 } from 'uuid';
const ChatUI = ({messages, loading}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {messages.map((message) => (
          <Message key={uuidv4()} message={message} />
        ))}

        {loading && (
          <Box key={uuidv4()} padding={'20px'} display={'flex'} alignItems={'flex-start'}>
            <Avatar src={RobotIcon}/>
            <Sending />

          </Box>
        )}
      </Box>
    </Box>
  );
};

const Message = ({ message }) => {
  const isBot = message.role === "assistant";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isBot ? "row" : "row-reverse",
          alignItems: "flex-start",
        }}
      >
        {isBot && (
          <Avatar src={RobotIcon} sx={{ bgcolor: isBot ? "primary.main" : "secondary.main" }}>

          </Avatar>
        )}
        {
          !isBot&& (
            <Avatar sx={{ bgcolor: isBot ? "primary.main" : "secondary.main" }}>
              我
            </Avatar>
          )
        }
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            ml: isBot ? 1 : 0,
            mr: isBot ? 0 : 1,
            backgroundColor: isBot ? "primary.light" : "secondary.light",
            borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
          }}
        >
          <Typography variant="body1">{message.content}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatUI;