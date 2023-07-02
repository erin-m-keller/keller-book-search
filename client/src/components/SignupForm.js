import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  FormControl,
  FormLabel,
  TextField
} from '@material-ui/core';

const SignupForm = () => {
// initialize variables
const [formData, setFormData] = useState({ username: '', email: '', password: '' });
const [showAlert, setShowAlert] = useState(false);
const [createUser, { error }] = useMutation(CREATE_USER);

// handle input change event
const handleInputChange = (event) => {
  // initialize variables
  const { name, value } = event.target;
  // update the user form data with the new value
  setFormData({ ...formData, [name]: value });
};

// handle form submission event
const handleFormSubmit = async (event) => {
  // prevent default behavior
  event.preventDefault();
  // initialize variables
  const form = event.currentTarget;
  // check form validity
  if (form.checkValidity() === false) {
    // prevent default behavior
    event.preventDefault();
    // stop the event propagation
    event.stopPropagation();
  }
  try {
    // perform createUser mutation with form data
    const { data } = await createUser({ variables: { ...formData } });
    // login user with received token
    Auth.login(data.createUser.token);
  } catch (err) {
    // log error
    console.error("Try/Catch Error: " + err);
    // log mutation error
    console.error("Mutation error: " + error);
    // show error
    setShowAlert(true);
  }
  // reset form data
  setFormData({ username: '', email: '', password: '' });
};

  return (
    <>
      <FormControl>
        <Alert show={showAlert} variant="filled" severity="error">
          Something went wrong with your signup!
          <div className="close-btn" onClick={() => setShowAlert(false)}>
            <FontAwesomeIcon icon={faClose} />
          </div>
        </Alert>
        <FormLabel>Enter Username:</FormLabel>
        <TextField
          type="username"
          placeholder="Your username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <FormLabel>Enter Email:</FormLabel>
        <TextField
          type="email"
          placeholder="Your email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <FormLabel>Enter Password:</FormLabel>
        <TextField
          type="password"
          placeholder="Your password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button onClick={handleFormSubmit} disabled={!(formData.username && formData.email && formData.password)}>
          Submit
        </Button>
      </FormControl>
    </>
  );
};

export default SignupForm;
