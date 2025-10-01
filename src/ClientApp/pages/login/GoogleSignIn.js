import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { auth, googleProvider } from '../../../core/api/config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';
import { login } from '../../../core/api/auth';

const buttonSx = {
  height: 50,
  fontSize: '1rem',
  textTransform: 'none',
  border: '1px solid #444',
  backgroundColor: '#161d27',
  color: '#ccc',
  mb: 1.5,
  '&:hover': {
    backgroundColor: '#222a35',
  },
};

export default function GoogleSignIn() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result) {
        const response = await login(result.user);
        const { token, user_id, displayName, photoURL, route } = response;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', user_id);
        localStorage.setItem('photoURL', photoURL);
        localStorage.setItem('displayName', displayName);
        try {
          const decoded = jwtDecode(token);
          const { exp } = decoded;

          if (Date.now() < exp * 1000 && user_id !== null) {
            setUser({ id: user_id });
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
          }
        } catch (decodeErr) {
          console.error('Failed to decode token:', decodeErr);
        }

        const target = route?.startsWith('http')
          ? new URL(route).pathname
          : route || '/dashboard';

        navigate(target, { replace: true });

      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Google Sign-In error:', err);
    }
  };

  return (
    <Button
      onClick={handleGoogle}
      startIcon={<GoogleIcon sx={{ fontSize: 30 }} />}
      sx={buttonSx}
      fullWidth
    >
      Google
    </Button>
  );
}
