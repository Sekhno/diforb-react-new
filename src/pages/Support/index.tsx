import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import { CountryService } from '../../services/CountryService';
import styles from './index.module.scss'
import countriesData from '../../models/json/countries.json'
import { Country } from '../../models/country'

type FormFieldName = 'email';

interface Errors {
  email?: string;
}

export const Support = () => {
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const countryservice = new CountryService();

  const formik = useFormik({
    initialValues: {
      email: '',
      country: null,
    },
    validate: (data) => {
      let errors: Errors = {};


      if (!data.email) {
        errors.email = 'Email is required.';
      }
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
        errors.email = 'Invalid email address. E.g. example@email.com';
      }

      return errors;
    },
    onSubmit: (data) => {
      setFormData(data);
      setShowMessage(true);

      formik.resetForm();
    }
  });

  const isFormFieldValid = (name: FormFieldName) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name: FormFieldName) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  return(
    <div className={styles.wrapper}>
      <div className="card p-fluid">

        <div className="p-float-label p-input-icon-right dui-mb-8">
          <i className="pi pi-envelope" />
          <InputText id="email"
                     name="email"
                     value={formik.values.email}
                     onChange={formik.handleChange}
                     className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
          <label htmlFor="email"
                 className={classNames({ 'p-error': isFormFieldValid('email') })}
          >Email*</label>
        </div>
        {getFormErrorMessage('email')}

        <div className="p-float-label dui-mb-8">
          <Dropdown id="country"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    options={countries}
                    optionLabel="name" />
          <label htmlFor="country">Country</label>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Support))