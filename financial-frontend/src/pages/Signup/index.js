import React, { useState } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect';
import { Formik } from 'formik'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import * as Yup from 'yup'

import Loader from 'components/Loader'
import formSubmit from 'utils/form'
import SignupForm from './form'

import { isRequestPending } from 'redux/modules/api/selectors'
import { signup } from 'redux/modules/auth/actions'
import logo from 'images/Logo.svg'

import './styles.scss';


const signupValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Username is required'),
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
})

const initValues = process.env.NODE_ENV === 'development' ? {
  name: 'admin',
  email: 'admin@example.com',
  password: 'uiojklm,.'
} : {
  name: '', email: '', password: ''
}

function Signup({ signup, history, registerRequestPending }) {
  const [message, setMessage] = useState()

  const handleSignupSubmit = (values, formActions) => {
    setMessage(null)
    formSubmit(
      signup,
      {
        data: values,
        success: () => history.push('/home'),
        fail: ({ status, data: { errors } }) => {
          if (status === 400) {
            for (const field in errors) {
              if (errors[field].length) {
                setMessage(errors[field][0])
                break;
              }
            }
          } else {
            setMessage('Network error')
          }
        }
      },
      formActions
    )
  }
  
  return (
    <Row className='Signup'>
      <Col className='Signup__Form-container'>
        <div className="mb-5 text-center">
          <img src={logo} alt='logo' className='mb-4 Signup__Logo' />
          <h1 className='text-white'>
            <strong>Earlybird</strong>
          </h1>
        </div>

        <Formik
          component={SignupForm}
          onSubmit={handleSignupSubmit}
          validationSchema={signupValidationSchema}
          initialValues={initValues}
        />
        
        {registerRequestPending && <Loader className='mt-3' />}
        
        {message && (
          <p className="text-danger text-center font-weight-bold mt-3">
            {message}
          </p>
        )}
      </Col>
    </Row>
  );
}

const selectors = createStructuredSelector({
  registerRequestPending: isRequestPending('register', 'post')
});

const actions = {
  signup
}

export default compose(
  connect(selectors, actions),
  withRouter
)(Signup);
