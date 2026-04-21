const firebaseConfig = {
  apiKey: "AIzaSyAFTs13hoggGVsKQF6NrTMmI8cf9dv3_pA",
  authDomain: "dhanmantri-37043.firebaseapp.com",
  projectId: "dhanmantri-37043",
  storageBucket: "dhanmantri-37043.appspot.com", 
  messagingSenderId: "880936899325",
  appId: "1:880936899325:web:ad141a112fc3e4f4552494"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore(); 