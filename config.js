import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCnP9kwb2pgmNktMuX5Azw6qdi3aev0GV4",
  authDomain: "barterapp2-cffc6.firebaseapp.com",
  projectId: "barterapp2-cffc6",
  storageBucket: "barterapp2-cffc6.appspot.com",
  messagingSenderId: "471219938813",
  appId: "1:471219938813:web:490b225f0924f90e8fe594"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();