import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './AddBusiness.css';

const YouTubeMenu = ({ onAddChannelJobs, onQuickTranscribe }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleQuickTranscribe = () => {
    handleMenuClose();
    onQuickTranscribe();
  };

  const handleAddChannelJobs = () => {
    handleMenuClose();
    onAddChannelJobs();
  };

  return (
    <>
      <IconButton onClick={handleButtonClick} variant="outlined" color="secondary">
        <YouTubeIcon  sx={{
            backgroundColor: '#161d27',
            borderColor: '#444 !important',
            color: '#fff',
            textTransform: 'none'
        }} variant="outlined" color="secondary" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleQuickTranscribe}>
          <ListItemIcon>
            <YouTubeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Quick YouTube transcribe" />
        </MenuItem>
        <MenuItem onClick={handleAddChannelJobs}>
          <ListItemIcon>
            <ExpandMoreIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add channel jobs" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default YouTubeMenu;
