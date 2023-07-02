import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import {
  AppBar,
  Box,
  Card,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@material-ui/core';

const AppNavbar = () => {
  // initialize variables
  const [open, setOpen] = useState(false); 
  const [value, setValue] = useState('login');

  // handle tab switch between login and sign up
  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  // open login/signup modal
  const handleOpen = () => {
    setOpen(true);
  };

  // close login/signup modal
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <>
      <AppBar color="secondary">
        <Toolbar>
          <IconButton edge="start" aria-label="menu">
            <FontAwesomeIcon icon={faBook} />
          </IconButton>
          <Typography variant="h6">
            Google Book Search
          </Typography>
          <IconButton>
            <Link to='/'>
                Search For Books
            </Link>
          </IconButton>
          <IconButton>
            {/* if user is logged in show saved books and logout */}
            {Auth.loggedIn() ? (
              <>
                <Link to='/saved'>
                  See Your Books
                </Link>
                <Link onClick={Auth.logout}>Logout</Link>
              </>
            ) : (
              <div onClick={handleOpen}>Login/Sign Up</div>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box>
          <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="Login or Sign Up">
            <Tab value="login" label="Login" />
            <Tab value="signup" label="Sign Up" />
          </Tabs>
          <Card variant="outlined">
            {value === "login" ? (
              <LoginForm />
            ) : (
              <SignUpForm />
            )}
          </Card>
        </Box>
      </Modal>
    </>
  );
};

export default AppNavbar;
