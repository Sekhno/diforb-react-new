import { getFirebaseStorage } from '../helpers/firebase.helper'

export const onLoadLibraries = () => {
  const firestore = getFirebaseStorage()
  return (dispatch: Function) => {

  }
}


/////////////////////////////////////////////
      // const firestore = firebase.firestore()
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