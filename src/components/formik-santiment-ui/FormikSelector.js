import React from 'react'
import { Selector } from '@santiment-network/ui'
import { Field } from 'formik'

const FormikSelector = ({ options, name, disabled = false }) => (
  <Field
    name={name}
    render={({ field, form }) => (
      <Selector
        options={options}
        disabled={disabled}
        onSelectOption={value => {
          form.setFieldValue(name, value)
          form.setFieldTouched(name, true)
        }}
        defaultSelected={field.value}
      />
    )}
  />
)

export default FormikSelector