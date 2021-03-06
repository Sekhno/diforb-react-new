import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/performance'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import { UserInterface, FirebaseConfig} from './firebase.interface'
import LIBRARIES from './_libraries'

type SocialType = 'google' | 'facebook'
type ProviderType = firebase.auth.GoogleAuthProvider_Instance | firebase.auth.FacebookAuthProvider_Instance

class FirebaseAuthBackend {
  constructor(firebaseConfig: FirebaseConfig) {
    if (firebaseConfig) {
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
      firebase.performance()
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setLoggeedInUser(user)
        } else {
          this.removeLoggeedInUser()
        }
      })
      /////////////////////////////////////////////
      const firestore = firebase.firestore()

      // firestore.collection('libraries').doc('L4QVEIkmDDboPX0gUY3K').set({
      //   data: LIBRARIES
      // })
      // firestore
      //     .collection('libraries')
      //     .get()
      //     .then(v => {
      //       console.log('Total users: ', v.size)

      //       v.forEach(documentSnapshot => {
      //         console.log('Libraries ID: ', documentSnapshot.id, documentSnapshot.data());
      //       })
      //     })
      /////////////////////////////////////////////////
      // firestore
      //   .collection('libraries')
      //   .doc('L4QVEIkmDDboPX0gUY3K')
      //   .onSnapshot(docSnapshot => {
      //     console.log(docSnapshot.data())
      //   })
      
    }
  }

  /**
   * @name registerUser Registers the user with given details
   */
  registerUser = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          user => {
            console.log(user)
            resolve(firebase.auth().currentUser)
          },
          error => {
            reject(this._handleError(error))
          }
        )
    })
  }

  /**
   * @name editProfileAPI Registers the user with given details
   */
  editProfileAPI = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          user => {
            console.log(user)
            resolve(firebase.auth().currentUser)
          },
          error => {
            reject(this._handleError(error))
          }
        )
    })
  }

  /**
   * @name loginUser Login user with given details
   */
  loginUser = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          user => {
            console.log(user)
            resolve(firebase.auth().currentUser)
          },
          error => {
            reject(this._handleError(error))
          }
        )
    })
  }

  /**
   * @name forgetPassword forget Password user with given details
   */
  forgetPassword = (email: string) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url:
            window.location.protocol + '//' + window.location.host + '/login',
        })
        .then(() => {
          resolve(true)
        })
        .catch(error => {
          reject(this._handleError(error))
        })
    })
  }

  /**
   * @name logout Logout the user
   */
  logout = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true)
        })
        .catch(error => {
          reject(this._handleError(error))
        })
    })
  }

  /**
   * @name socialLoginUser Social Login user with given details
   */
  socialLoginUser = (type: SocialType): Promise<any> => {
    let provider: ProviderType | null = null

    if (type === 'google') {
      provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
    } else if (type === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider()
      provider.addScope('user_birthday')
    } else {
      return Promise.reject('?????? ???? ?? ?????????????????????? ???? ??????')
    }

    return firebase.auth().signInWithPopup(provider)
  }

  addNewUserToFirestore = (user: any) => {
    const collection = firebase.firestore().collection('users')
    const { profile } = user.additionalUserInfo
    const details = {
      firstName: profile.given_name ? profile.given_name : profile.first_name,
      lastName: profile.family_name ? profile.family_name : profile.last_name,
      fullName: profile.name,
      email: profile.email,
      picture: profile.picture,
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginTime: firebase.firestore.FieldValue.serverTimestamp()
    }
    collection.doc(firebase.auth().currentUser?.uid).set(details)
    return { user, details }
  }

  setLoggeedInUser = (user: firebase.User) => {
    localStorage.setItem('authUser', JSON.stringify(user))
  }

  removeLoggeedInUser = () => {
    localStorage.removeItem('authUser')
  }

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = (): firebase.User | null => {
    if (!localStorage.getItem('authUser')) return null
    return JSON.parse(localStorage.getItem('authUser') || '')
  }

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error: { message: string }) {
    // var errorCode = error.code;
    var errorMessage = error.message
    return errorMessage
  }

  updateUser = () => {
    // firebase.auth().currentUser?.updateProfile()
  // .updateUser(uid, {
  //   email: 'modifiedUser@example.com',
  //   phoneNumber: '+11234567890',
  //   emailVerified: true,
  //   password: 'newPassword',
  //   displayName: 'Jane Doe',
  //   photoURL: 'http://www.example.com/12345678/photo.png',
  //   disabled: true,
  // })
  // .then((userRecord) => {
  //   // See the UserRecord reference doc for the contents of userRecord.
  //   console.log('Successfully updated user', userRecord.toJSON());
  // })
  // .catch((error) => {
  //   console.log('Error updating user:', error);
  // });
  }
}

let _fireBaseBackend: FirebaseAuthBackend | null = null

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config: FirebaseConfig): FirebaseAuthBackend => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config)
  }
  return _fireBaseBackend
}

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend
}

const getFirebaseStorage = () => {
  return firebase.storage()
}

const getFirebaseFirestore = () => {
  return firebase.firestore()
}

/**
 * firebase analytics
 * */
const logEvent = (eventName: string, eventParams?: Record<string, string>) => {
  const analytics =  firebase.analytics();
  analytics.logEvent(eventName, eventParams)
}

export { initFirebaseBackend, getFirebaseBackend, getFirebaseStorage, getFirebaseFirestore, logEvent }