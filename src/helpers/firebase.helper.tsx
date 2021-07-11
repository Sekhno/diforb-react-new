import firebase from 'firebase/app'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import { UserInterface, FirebaseConfig} from './firebase.interface'


type SocialType = 'google' | 'facebook'
type ProviderType = firebase.auth.GoogleAuthProvider_Instance | firebase.auth.FacebookAuthProvider_Instance

class FirebaseAuthBackend {
  constructor(firebaseConfig: FirebaseConfig) {
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig)
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // localStorage.setItem('authUser', JSON.stringify(user))
          this.setLoggeedInUser(user)
        } else {
          // localStorage.removeItem('authUser')
          this.removeLoggeedInUser()
        }
      })
      /////////////////////////////////////////////
      const firestore = firebase.firestore()
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
      return Promise.reject('Что то с провайдером не так')
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

export { initFirebaseBackend, getFirebaseBackend, getFirebaseStorage, getFirebaseFirestore }