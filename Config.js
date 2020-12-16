import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCayJYSo2mVgXKPJp_-5vr_YEPVBIpGoPs",
    authDomain: "mobile-library-3331c.firebaseapp.com",
    projectId: "mobile-library-3331c",
    storageBucket: "mobile-library-3331c.appspot.com",
    messagingSenderId: "265079664236",
    appId: "1:265079664236:web:45f6768da558bdc92c3249"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  export default firebase.firestore() 
