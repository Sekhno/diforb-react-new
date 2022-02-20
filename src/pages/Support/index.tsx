import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import { CountryService } from '../../services/CountryService';
import { getFirebaseFirestore, getFirebaseBackend } from '../../helpers/firebase.helper'
import styles from './index.module.scss';
import countriesData from '../../models/json/countries.json';
import { Country } from '../../models/country';

type FormFieldName = 'email' | 'message';

interface Errors {
  email?: string;
  message?: string;
}

const SUPPORT = 'support';

export const Support = () => {
  const db = getFirebaseFirestore();
  const user = getFirebaseBackend()?.getAuthenticatedUser();
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const countryservice = new CountryService();

  const formik = useFormik({
    initialValues: {
      email: '',
      country: null,
      message: ''
    },
    validate: (data) => {
      let errors: Errors = {};


      if (!data.email) {
        errors.email = 'Email is required.';
      }
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
        errors.email = 'Invalid email address. E.g. example@email.com';
      }
      if (!data.message) {
        errors.message = 'Message is required.'
      }

      return errors;
    },
    onSubmit: (data) => {
      setFormData(data);
      setShowMessage(true);

      formik.resetForm();
      sendMessageToSupport()
    }
  });

  const isFormFieldValid = (name: FormFieldName) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name: FormFieldName) =>
  {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  const sendMessageToSupport = () =>
  {
    const { email, country, message } = formik.values;
    const date = new Date();

    if (!user) {
      console.log('You don\'t registered!');
      return;
    }
    if (!message) {
      console.log('Your review is empty! Please type your review about our DifOrb!');
      return;
    }


    db.collection(SUPPORT).doc(email || 'undefined')
        .set({ email, country, date, message})
        .then(() => {

        }).catch(console.error)
  }

  return(
    <div className={styles.wrapper}>
      <div className="card p-fluid">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="p-float-label p-input-icon-right dui-mt-6">
            <i className="pi pi-envelope" />
            <InputText id="email"
                       name="email"
                       value={formik.values.email}
                       onChange={formik.handleChange}
                       className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
            <label htmlFor="email"
                   className={classNames({ 'p-error': isFormFieldValid('email') })}
            >Email*</label>
            {getFormErrorMessage('email')}
          </div>

          <div className="p-float-label dui-mt-6">
            <Dropdown id="country"
                      name="country"
                      value={formik.values.country}
                      options={countriesData}
                      optionLabel="name"
                      onChange={formik.handleChange}/>
            <label htmlFor="country">Country</label>
          </div>
          <div className="p-float-label dui-mt-6">
            <InputTextarea id="message" autoResize
                           value={formik.values.message}
                           onChange={formik.handleChange} />
            <label htmlFor="message"
                   className={classNames({ 'p-error': isFormFieldValid('message') })}
            >Message</label>
            {getFormErrorMessage('message')}
          </div>

          <Button type="submit" label="Submit" className="dui-mt-4" />
        </form>
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