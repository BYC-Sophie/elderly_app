import {Box, Button, Container, Paper} from "@mui/material";
import Robot from '../assets/images/robot.png';
import {ChatBox} from "./ChatBox";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

export const ArticleGenerate = () => {

  const navigate = useNavigate();
  const currentArticle = useSelector(state => state.article.currentArticle);
  const handleClickReGenerate = () => {

  }

  const handleClickEdit = () => {
    navigate('edit')
  }

  return (
    <Container>
      <Box textAlign={'center'} marginTop={'30px'}>
        <ChatBox message={`根据您的分享，我为您生成了一篇范文，您觉得怎么样？`}>
          <img src={Robot} width={100}/>
        </ChatBox>
      </Box>
      <Paper
        dangerouslySetInnerHTML={{
          __html: currentArticle
        }}
        className={'mt-3 p-4'}
        style={{
          maxHeight: '70vh',
          overflow: 'auto'
        }}
        elevation={3} >

      </Paper>
      <Box className={'mt-5'} display={'flex'} justifyContent={'center'}>
        <Button
          onClick={handleClickReGenerate}
          className={'me-3'}
          color={'inherit'}
          variant={'contained'}>
          我觉得一般，可以再来一篇吗
        </Button>
        <Button
          onClick={handleClickEdit}
          variant={'contained'}>
          我很喜欢，就选它了
        </Button>
      </Box>
    </Container>
  )
}