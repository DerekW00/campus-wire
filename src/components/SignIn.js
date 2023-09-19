import { Input, Button } from "@chakra-ui/react";
import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from '../services/firebase';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useState } from "react";
import { Link as ChakraLink } from '@chakra-ui/react';


function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const login = (e) => {
        console.log('sign in button clicked');
        e.preventDefault();
        setPersistence(auth, browserLocalPersistence)
        .then(() => {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                // direct them to home page
            })
            .catch((error) => setError(error.message));
        })
        .catch((error) => setError(error.message));
    }

    return (
        <div>
            Sign in to your account
            Email:
            <Input
                type="text"
                placeholder="oski@berkeley.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            Password:
            <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div>Error message: {error}</div>}
            <Button onClick={login}> Sign In </Button>
            Or
            <Button>Sign In with Google</Button>
            <Button>Sign In with Facebook</Button>

            Not a member?{' '}
            <ChakraLink as={ReactRouterLink} to="/SignUp">
                Sign Up
            </ChakraLink>
        </div>
    );
}

export default SignIn;