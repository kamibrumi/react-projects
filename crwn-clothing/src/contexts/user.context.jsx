import { createContext, useState, useEffect } from 'react';
import { onAuthStateChangedListener, signOutUser, createUserDocumentFromAuth } from '../utils/firebase/firebase.utils';

// as the actual value you want to access
export const UserContext = createContext({ // pass the default value
    currentUser: null, // no context when null
    setCurrentUser: () => null

});

// provider is a literal functional component
// So on every context that gets built for us, there is a dot provider and the dot provider is the component
// that will wrap around any other components that need access to the values inside.
// all subcomponents of the component wrapped by the provider will have access to the user data

// value is gonna hold the contextual values 
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser };

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => { 
            if (user) {
                createUserDocumentFromAuth(user);
            }
            console.log(user); 
            setCurrentUser(user);
        }); // unsusbcribe is a function that will unsubscribe/stop listening.

        return unsubscribe; // useEffect will run whatever it returns when it unmounts.
    }, []);
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}