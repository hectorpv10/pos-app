import { getFirestore } from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

/* Old Firebase config
export const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY + '',
	authDomain: 'pos-app-7c658.firebaseapp.com',
	projectId: 'pos-app-7c658',
	storageBucket: 'pos-app-7c658.firebasestorage.app',
	messagingSenderId: '89928982376',
	appId: '1:89928982376:web:64d5363712b0bee33f40dd',
};
*/

// New Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyCr3qTOnKEE6UKDjDsKZV63Km-UfN5dL5c",
  authDomain: "pos-app-7c658.firebaseapp.com",
  projectId: "pos-app-7c658",
  storageBucket: "pos-app-7c658.firebasestorage.app",
  messagingSenderId: "89928982376",
  appId: "1:89928982376:web:64d5363712b0bee33f40dd",
  measurementId: "G-F98SQCHEWS"
};
