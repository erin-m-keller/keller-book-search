// see SignupForm.js for comments
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  FormControl,
  FormLabel,
  TextField
} from '@material-ui/core';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [login, { error }] = useMutation(LOGIN_USER);

  // handle input change event
  const handleInputChange = (event) => {
    // initialize variables
    const { name, value } = event.target;
    // update the user form data with the new value
    setUserFormData({ ...userFormData, [name]: value });
  };
  
  // handle form submission event
  const handleFormSubmit = async (event) => {
    // prevent default behavior
    event.preventDefault();
    // get the form element
    const form = event.currentTarget;
    // check if the form is valid
    if (!form.checkValidity()) {
      // stop the event propagation and return if the form is invalid
      event.stopPropagation();
      return;
    }
    try {
      // perform the login mutation with the user form data
      const { data } = await login({ variables: { ...userFormData } });
      // login the user with the received token
      Auth.login(data.login.token);
    } catch (err) {
      // log the error
      console.error("Try/Catch Error: " + JSON.stringify(err));
      // log the mutation error
      console.error("Mutation error: " + error);
      // show the alert for displaying the error
      setShowAlert(true);
    }
    // reset the user form data
    setUserFormData({ email: "", password: "" });
  };

  return (
    <>
      <FormControl>
        <Alert show={showAlert} variant="filled" severity="error">
          Something went wrong with your login credentials!
          <div className="close-btn" onClick={() => setShowAlert(false)}>
            <FontAwesomeIcon icon={faClose} />
          </div>
        </Alert>
        <FormLabel>Enter Email:</FormLabel>
        <TextField
          type="email"
          name="email"
          value={userFormData.email}
          onChange={handleInputChange}
        />
        <FormLabel>Enter Password:</FormLabel>
        <TextField
          type="password"
          name="password"
          value={userFormData.password}
          onChange={handleInputChange}
        />
        <Button onClick={handleFormSubmit} disabled={!(userFormData.email && userFormData.password)}>
          Submit
        </Button>
      </FormControl>
    </>
  );
};

export default LoginForm;
