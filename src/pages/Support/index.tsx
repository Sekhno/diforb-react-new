import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { CountryService } from '../../services/CountryService';
import styles from './index.module.scss'
import countriesData from '../../models/json/countries.json'
import { Country } from '../../models/country'



export const Support = () => {
  const [value, setValue] = useState('');
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const countryservice = new CountryService();

  return(
    <div className = { styles.wrapper }>
      <div className="card">
        <div className="p-float-label">
          <InputText className={ styles.input }

                     value={value}
                     validateOnly={true}
                     onChange={(e) => setValue(e.target.value)} />
          <label htmlFor="username">Email</label>
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