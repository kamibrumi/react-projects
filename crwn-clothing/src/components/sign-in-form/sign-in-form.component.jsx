import Authentification from "../../routes/authentification/authentification.component";
import { useState } from "react";
import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
} from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import "./sign-in-form.styles.scss";
import Button from "../button/button.component";

// import { UserContext } from '../../contexts/user.context';

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields); // defaultFormFields object is being passed as a default state for useState
  const { email, password } = formFields;

  console.log(formFields);

  // const { setCurrentUser }  = useContext(UserContext);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    await signInWithGooglePopup();

  };

  const handleSubmit = async (event) => {
    // async bc we're generating a user document in an external method.
    // the event is created onSubmit of the form
    event.preventDefault(); // we don't want any default behavior of the form.
    console.log("Clicked submit");

    try {
      // we might fail dealing with firebase
      const { user } = await signInAuthUserWithEmailAndPassword(
        email,
        password
      );

      // setCurrentUser(user);

      resetFormFields();
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          alert("Incorrect password for email");
          break;
        case "auth/user-not-found":
          alert("no user associated with this email");
          break;
        default:
          console.log(error);
      }
    }

    // leverage the email and password fields. Use display name when creating the user document.

    // console.log(userAuth);

    // const userDocument = await createUserDocumentFromAuth(userAuth);

    // return userDocument;
  };

  const handleChange = (event) => {
    const { name, value } = event.target; // target give us the thing that emits the event, in this case, the input tag

    setFormFields({ ...formFields, [name]: value }); // we want to update only the appropriate field, so all the prev fields that were previously on this state I want them to be spread on. [name]: value updates the appropriate field
  };

  return (
    <div className="sign-up-container">
      <h2>Already haver an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />

        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" onClick={signInWithGoogle} buttonType="google">
            Google Sign In
          </Button>
        </div>
      </form>
    </div>
  ); // we give each input label the name attribute in order to be able to track the input in the object we created above.
};

export default SignInForm;
