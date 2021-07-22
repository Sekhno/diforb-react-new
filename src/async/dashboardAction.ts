import { getFirebaseFirestore } from '../helpers/firebase.helper'
import { getLibraries } from '../pages/Home/dashboardSlice'

export const onLoadLibraries = () => {
  const firestore = getFirebaseFirestore()
  return async (dispatch: Function) => {
    const response = await firestore.collection('libraries').get()
    response.forEach(documentSnapshot => {
      console.log('Libraries ID: ', documentSnapshot.id, documentSnapshot.data())
      dispatch(getLibraries(documentSnapshot.data().data as any[]))
    })
    
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