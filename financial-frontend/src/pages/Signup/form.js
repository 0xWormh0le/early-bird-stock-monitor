import React from 'react'
import Button from 'react-bootstrap/Button'
import { Field } from 'formik'
import FormInput from 'components/FormInput'

export default function ({ handleSubmit, isSubmitting }) {
  return (
    <form onSubmit={handleSubmit}>
      <Field name="name" type="text" placeholder="Username" component={FormInput} autoFocus/>
      <Field name="email" type="email" placeholder="Email" component={FormInput} />
      <Field name="password" type="password" placeholder="Password" component={FormInput} />
      
      <Button variant="primary" type="submit" className="btn-block" disabled={isSubmitting}>
        Get Started
      </Button>
    </form>
  )
}
