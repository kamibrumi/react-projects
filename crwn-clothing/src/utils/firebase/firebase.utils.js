import  { getApps, initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3hRxo8u5WMF5ayEv25myZB8_ZQxxhp6U",
    authDomain: "crw-clothing-db-10572.firebaseapp.com",
    projectId: "crw-clothing-db-10572",
    storageBucket: "crw-clothing-db-10572.appspot.com",
    messagingSenderId: "358117885698",
    appId: "1:358117885698:web:cfdec51e291f9602e4241b"
};
  
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider(); // could have a facebookProvider instead, or github provider etc
googleProvider.setCustomParameters({
prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
// export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();
export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
    if (!userAuth) return;
    // see if there is an exisgin doc reference
    const userDocRef = doc(db, 'users', userAuth.uid); // 'users' is collection name

    console.log(userDocRef);

    const userSnapshot = await getDoc(userDocRef);
    console.log(userSnapshot.exists());

    if(!userSnapshot.exists()) {
        // create and set the document
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            // to set the doc
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation 
            });
        } catch (error) {
            console.log('error creating the user', error.message);
        }
    }

    return userDocRef;
    // if user data exists
    // create/set the document with the data from userAuth in my collection

    // if user data does not exist

    // return userDocRef
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
}