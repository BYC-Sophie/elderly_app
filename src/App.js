import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {BottomNavigation, BottomNavigationAction, Box, Container} from '@mui/material';
import {useEffect, useMemo, useState} from "react";
import Diversity1Icon from '@mui/icons-material/Diversity1';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ChatIcon from '@mui/icons-material/Chat';
import Playground from "./pages/playground";
import Studio from "./pages/studio";
import ChatGpt from "./pages/chatgpt";
import ArticlePage from './pages/Article/article'

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      path: 'playground',
      icon: <Diversity1Icon />,
      label: '美文广场'
    },
    {
      path: 'studio',
      icon: <EditNoteIcon />,
      label: '编辑'
    },
    {
      path: 'chat-gpt',
      icon: <ChatIcon />,
      label: '智能助手'
    }
  ];

  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    if (location) {
      const tab = tabs.find(tab => {
        return location.pathname.includes(tab.path) && location.pathname !== '';
      });
      if (tab) {
        setCurrentLocation(tab.path);
      }
    }
  }, [location]);

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };
  return (
    <Box>
      <Routes>
        <Route path={''} index element={<Navigate to={'playground'}/>}/>
        <Route path={'playground'} element={<Playground />}/>
        <Route path={'studio'} element={<Studio />}/>
        <Route path={'chat-gpt'} element={<ChatGpt />}/>

        {/* Post Article Page */}
        <Route path='/article/:id' element={<ArticlePage />} />
      </Routes>
      <BottomNavigation
        onChange={handleChange}
        value={currentLocation}
        showLabels
        style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}
      >
        {tabs.map(tab => {
          return (
            <BottomNavigationAction
              key={tab.path}
              value={tab.path}
              label={tab.label}
              icon={tab.icon} />
          )
        })}
      </BottomNavigation>
    </Box>
  );
}

export default App;
