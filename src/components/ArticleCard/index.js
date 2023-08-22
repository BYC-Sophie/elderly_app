import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function PostCard({ id, title, itemStyle}) {
  const navigate = useNavigate(); // 获取导航函数

  const handleReadClick = () => {
    // 点击事件，使用 navigate 函数跳转到文章页面，传递文章ID作为参数
    navigate(`/article/${id}`);
  };

  return (
    <div style={{ margin: '5px', paddingLeft: '8px', paddingRight: '8px' }}>
      <Card sx={{ marginBottom: '10px', backgroundColor: '#70A9A1' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Button variant="outlined" onClick={handleReadClick}>
            阅读文章
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostCard;
