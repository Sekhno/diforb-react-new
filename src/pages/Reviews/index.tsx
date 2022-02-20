import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Avatar } from 'primereact/avatar'
import { format } from 'date-fns'
import { getFirebaseFirestore, getFirebaseBackend } from '../../helpers/firebase.helper'
import { Review } from '../../helpers/firebase.interface'
import styles     from './index.module.scss'
import DuiAvatar from "../../components/Common/DuiAvatar";

const REVIEWS = 'reviews'

const Reviews = () => {
  const db = getFirebaseFirestore()
  const user = getFirebaseBackend()?.getAuthenticatedUser()
  const [ reviewList, setReviewList ] = useState<Review[]>()
  const [ review, setReview ] = useState('')
  const [ error, setError ] = useState('')
  const [ used, setUsed ] = useState(false)
  
  const saveReview = () => {
    if (!user) return setError('You don\'t registered!')
    if (!review) {
      return setError('Your review is empty! Please type your review about our DifOrb!')
    }
    const { email, displayName, photoURL } = user

    db.collection(REVIEWS).doc(email || 'undefined').set({
      name: displayName,
      photo: photoURL,
      date: new Date(),
      review: review 
    })
    .then(() => {
      getReviews()
    })
    .catch(console.error)
  }

  const getReviews = () => {
    db.collection(REVIEWS).get()
      .then((querySnapshot) => {
        const reviews: Review[] = []
        querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data())
          if (doc.id === user?.email) {
            setUsed(true)
          }
          reviews.push(doc.data() as Review)
        })
        setReviewList(reviews)
      }).catch(console.error)
  }

  useEffect(() => {
    getReviews()
  }, [])

  return(
    <div className = { styles.wrapper }>
      {
        used ?
        <div className = { styles.form }>
          <h1>Thank You for your review!</h1>
        </div> :
        <div className = { styles.form }>
          {
            error ? <div className = { styles.error }>{ error }</div> 
            : <h1>Please! Leave a review about our application</h1>
          }
          <textarea rows = {5} value = { review } 
            onChange = {(e) => setReview(e.target.value)} 
            onFocus = { () => setError('') }/>
          <button onClick = { saveReview }>Save</button>
        </div>
      }
      
      <div className = { styles.reviewsWrapper }>
        <ul>
          {
            reviewList?.map((v, i) => {
              const { photo, date, name, review } = v
              const objDate: Date = date.toDate()
              const formatedDate = format(objDate, 'dd MMMM yyyy')
              
              return (
                <li key = {i}>
                  <div className = { styles.avatar }>
                    <DuiAvatar photo = { photo }/>
                  </div>
                  <div className = { styles.article }>
                    <div className = { styles.date }>
                      { formatedDate }
                    </div>
                    <div className = { styles.message }>
                      { review }
                    </div>
                    <div className = { styles.author }>
                      { name }
                    </div>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Reviews))