// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  EmailAuthProvider, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: "AIzaSyDM297uhmHoo6apZjjnHLbY_xOw3CiT2Oc",
    authDomain: "fir-web-codelab-603d5.firebaseapp.com",
    projectId: "fir-web-codelab-603d5",
    storageBucket: "fir-web-codelab-603d5.appspot.com",
    messagingSenderId: "66141481493",
    appId: "1:66141481493:web:a65de9a197b8a5ed0dbc1c",
    measurementId: "G-RXBCL3TL0Z"
  };

  initializeApp(firebaseConfig);
  auth = getAuth();
  db = getFirestore();

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

 const ui = new firebaseui.auth.AuthUI(auth);
 startRsvpButton.addEventListener('click', () => {
  if (auth.currentUser) {
    // User is signed in; allows user to sign out
    signOut(auth);
  } else {
    // No user is signed in; allows user to sign in
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});


 onAuthStateChanged(auth, user => {
   if(user){
     startRsvpButton.textContent = 'LogOut';
     guestbookContainer.style.display = 'block';
   }else{
     startRsvpButton.textContent = 'RSVP';
     guestbookContainer.style.display = 'none';
   }
 });


 form.addEventListener('submit', async e => {
   e.preventDefault();

   addDoc(collection(db, 'guestbook'), {
     text: input.value,
     timestamp:Date.now(),
     name: auth.currentUser.displayName,
    userId: auth.currentUser.uid
   });

   input.value = '';
   return false;
 });

 function subscribeGuestbook() {
  const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
  guestbookListener = onSnapshot(q, snaps => {
    // Reset page
    guestbook.innerHTML = '';
    // Loop through documents in database
    snaps.forEach(doc => {
      // Create an HTML entry for each document and add it to the chat
      const entry = document.createElement('p');
      entry.textContent = doc.data().name + ': ' + doc.data().text;
      guestbook.appendChild(entry);
    });
  });

}




}


main();