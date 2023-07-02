import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookmark, faRightFromBracket, faSearch } from '@fortawesome/free-solid-svg-icons';
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
            <FontAwesomeIcon icon={faBook} className="navigation-icon" />
          </IconButton>
          <Typography variant="h6">
            Google Book Search
          </Typography>
          <div className="navigation-link">
            <Link to='/'>
              <FontAwesomeIcon icon={faSearch} />&nbsp;Search For Books
            </Link>
          </div>
          <div className="navigation-link">
            {/* if user is logged in show saved books and logout */}
            {Auth.loggedIn() ? (
              <>
                <div className="navigation-link">
                  <Link to='/saved'><FontAwesomeIcon icon={faBookmark} />&nbsp;Saved Books</Link>
                </div>
                <div className="navigation-link">
                  <div onClick={Auth.logout}><FontAwesomeIcon icon={faRightFromBracket} />&nbsp;Logout</div>
                </div>
              </>
            ) : (
              <div onClick={handleOpen}><FontAwesomeIcon icon={faRightFromBracket} />&nbsp;Login/Sign Up</div>
            )}
          </div>
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
