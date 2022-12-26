import Authentification from "../../routes/authentification/authentification.component";
import { useState } from "react";
import { createAuthUserWithEmailAndPassword , createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import './sign-up-form.styles.scss';
import Button from "../button/button.component";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields); // defaultFormFields object is being passed as a default state for useState
  const { displayName, email, password, confirmPassword } = formFields;

  console.log(formFields);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  }

  const handleSubmit = async (event) => { // async bc we're generating a user document in an external method.
    // the event is created onSubmit of the form
    event.preventDefault(); // we don't want any default behavior of the form.
    console.log("Clicked submit");

    if (password != confirmPassword) {
        alert("passwords do not match");
        return;
    }

    try { // we might fail dealing with firebase
        const { user } = await createAuthUserWithEmailAndPassword(email, password);

        await createUserDocumentFromAuth(user, { displayName }); // the {} make displayName an object, which is assumed in the function definition found in the utils.
        resetFormFields();
    } catch (error) {
        if (error.code == 'auth/email-already-in-use') alert('Cannot create user, email already in use.');
        else {
            console.log("user creation encountered an error", error);
        }
    }

    // leverage the email and password fields. Use display name when creating the user document.
    
    // console.log(userAuth);

    // const userDocument = await createUserDocumentFromAuth(userAuth);

    // return userDocument;
  }

  const handleChange = (event) => {
    const { name, value } = event.target; // target give us the thing that emits the event, in this case, the input tag

    setFormFields({ ...formFields, [name]: value }); // we want to update only the appropriate field, so all the prev fields that were previously on this state I want them to be spread on. [name]: value updates the appropriate field
  };

  return (
    <div className="sign-up-container">
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Display Name"
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
        />

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

        <FormInput
          label="Confirm Password"
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
        />

        <Button type="submit" >Sign Up</Button>
      </form>
    </div>
  ); // we give each input label the name attribute in order to be able to track the input in the object we created above.
};

export default SignUpForm;
