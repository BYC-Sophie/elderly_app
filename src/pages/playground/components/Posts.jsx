import {Box, Card, CardContent, Paper} from "@mui/material";


export default function Posts() {
  return (
    <Box>
      <Card
        component={Paper} elevation={2}>
        <CardContent>
          用户的文章1
        </CardContent>
      </Card>
      <Card
        style={{
          marginTop: '20px'
        }}
        component={Paper} elevation={2}>
        <CardContent>
          用户的文章2
        </CardContent>
      </Card>
    </Box>
  )
}