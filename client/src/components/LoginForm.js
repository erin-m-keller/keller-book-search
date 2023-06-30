// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_USER } from "../utils/mutations";
import Auth from '../utils/auth';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
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
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
