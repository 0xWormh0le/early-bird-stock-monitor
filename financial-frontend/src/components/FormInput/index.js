import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'

const FormInput = ({ className, field, form, label, multiline, placeholder, rows, type, ...other }) => {
  const error = form.touched[field.name] && form.errors[field.name]
  const Control = type === 'checkbox' ? Form.Check : Form.Control

  return (
    <Form.Group controlId={field.name} className={cn('FormInput', className)}>
      {type !== 'checkbox' && label && <Form.Label>{label}</Form.Label>}
      <Control
        type={type}
        as={multiline ? 'textarea' : 'input'}
        placeholder={placeholder}
        rows={rows}
        name={field.name}
        value={field.value || ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        isInvalid={Boolean(error)}
        disabled={form.isSubmitting}
        label={type === 'checkbox' ? label : undefined}
        {...other}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  )
}

FormInput.propTypes = {
  className: PropTypes.string,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  multiline: PropTypes.bool,
  type: PropTypes.string
}

FormInput.defaultProps = {
  type: 'text'
}

export default FormInput
