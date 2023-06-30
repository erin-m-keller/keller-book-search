import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
// initialize variables
const [formData, setFormData] = useState({ username: '', email: '', password: '' });
const [validated] = useState(false);
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
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={formData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={formData.email}
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
            value={formData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formData.username && formData.email && formData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
