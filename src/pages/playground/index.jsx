import {Box, Button, Container, Typography} from "@mui/material";
import Posts from "./components/Posts";
import {useNavigate} from "react-router-dom";


export default function Playground() {

  const navigate = useNavigate();

  return (
    <Container>

      <Box marginTop={'20px'}>
        <Typography textAlign={'center'} variant={'h5'}>
          美文广场
        </Typography>
        <Typography marginTop={'20px'}>
          以下是前面的老人参与者完成的优秀写作。相信在智能助手的帮助下，
          您也可以写出一样优美的文章
        </Typography>
      </Box>

      <Box marginTop={'30px'}>
        <Posts />
      </Box>

      <Box marginTop={'20px'}>
        <Typography>
          写作可以帮助记录生活，益智养生。您的佳作也能为他人带来好心情，传递自己的智慧和感悟，快来开启您的创作吧!
        </Typography>
      </Box>

      <Box textAlign={'center'} marginTop={'40px'}>
        <Button
          onClick={() => {
            navigate('/studio')
          }}
          variant={'contained'}>
          开始创作！
        </Button>
      </Box>
    </Container>
  )
}