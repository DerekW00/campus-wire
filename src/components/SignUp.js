import { useState } from 'react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button, Text, Input } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';



function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = () => {
    let isValid = true;
    if (password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        isValid = false;
        setError('Passwords do not match');
      }
    }
    return isValid;
  };

  const register = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // Create a new user with email and password using firebase
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          console.log(res.user);
          updateProfile(res.user, {
            displayName: name
          }).then(() => {
            console.log(res.user.displayName);
            console.log(res.user.uid);
          }).catch((error) => setError(error.message));
        })
        .catch((err) => setError(err.message));
    }
    navigate('/Welcome');
    
  };

  return (
    <div>
      <div class="top-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
        <h3>Sign Up</h3>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: '340px' }}>
      Name
      <Input
        type="text" 
        placeholder="Oski"
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <div style={{ height: "10px"}}></div>

      Email Address
      <Input
        type="email"
        placeholder="oski@berkeley.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div style={{ height: "10px"}}></div>
      
      Password
      <Input
        type="password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div style={{ height: "10px"}}></div>
      
      Confirm Password
      <Input
        type="password"
        placeholder="********"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <div>Error message: {error}</div>}
      
      <div style={{ paddingTop: '150px', height: '100px', display: "flex", alignItems: 'center', justifyContent: 'center'}}>
        <Button onClick={register}>Sign Up</Button>
      </div>
      <div style={{ paddingTop: '70px', height: '100px', display: "flex", alignItems: 'center', justifyContent: 'center'}}>
        <Text>Or</Text>
      </div>
      <div style={{ height: '100px', display: "flex", alignItems: 'center', justifyContent: 'center'}}>
        <Button><img src="google.png" alt='google' /></Button>
        <div style={{ width: '10px' }}></div>
        <Button><img src="facebook.png" alt='facebook' /></Button>
      </div>

      <div style={{ height: "10px"}}></div>

      <div style={{ height: '50px', display: "flex", alignItems: 'center', justifyContent: 'center'}}>
        Already a member?{' '}
        <ChakraLink as={ReactRouterLink} to="/SignIn">
          <strong>Sign In</strong>
        </ChakraLink>
      </div>
      </div>
      </div>
    </div>
  );
}

export default SignUp;
