import AppleIcon from '@mui/icons-material/Apple';
import { Button } from '@mui/material';
import { auth, appleProvider } from '../../../core/api/config/firebase';
import { signInWithPopup } from "firebase/auth";

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

export default function AppleSignIn() {
  appleProvider.setCustomParameters({ locale: 'en' });

  const handleApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      console.log("Apple user:", result.user);
    } catch (err) {
      console.error("Apple Sign‑In error:", err);
    }
  };

  return  <Button onClick={handleApple} startIcon={<AppleIcon sx={{ fontSize: 30 }} />} sx={buttonSx} fullWidth>
            Apple
          </Button>
}
