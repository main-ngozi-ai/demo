import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  keyframes,
  styled
} from '@mui/material';
import ReactGifPlayer from 'react-gif-player';
import GoogleSignIn   from './GoogleSignIn';
import AppleSignIn    from './AppleSignIn';
import { getRandomAgentActivities } from '../../../core/api/auth';

const BG   = '#161d27';
const GLOW = '#FFB74D';
const DIM  = '#444';

const LEFT_X   = 44;
const GAP_XTRA = 40;
const LEFT_W   = 660;

const LOGIN_W   = 360;
const LOGIN_GAP = 470;
const FRAME_H   = '75vh';
const LINE_H    = 2;
const BEACON    = 10;

const CONNECTOR_LEFT = LEFT_X + GAP_XTRA + LEFT_W - 63;
const LOGIN_LEFT     = CONNECTOR_LEFT + LOGIN_GAP;

const flicker = keyframes`
  0%,100% { box-shadow:0 0 4px #FF9800,0 0 8px #FF9800 }
  25%     { box-shadow:0 0 8px #FFA726,0 0 16px #FB8C00 }
  50%     { box-shadow:0 0 4px #FB8C00,0 0 8px #FFA726 }
  75%     { box-shadow:0 0 8px #FB8C00,0 0 16px #FFA726 }
`;

const scrollUp = keyframes`
  0%   { transform: translateY(0%);   }
  100% { transform: translateY(-100%);}
`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

const cardSx = {
  width: '100%',
  backgroundColor: BG,
  border: `1px solid ${DIM}`,
  borderRadius: 2,
  color: '#ccc',
  '& .MuiCardHeader-title':     { fontWeight: 600, color: GLOW },
  '& .MuiCardHeader-subheader': { color: '#888' }
};

const LogoBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: 20,
  transform: 'translateX(-50%)',
  padding: '8px 24px',
  backgroundColor: BG,
  border: `1px solid ${GLOW}`,
  borderRadius: 9999,
  fontWeight: 600,
  color: '#ccc',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: { top: 12 }
}));

const LeftFrame = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: LEFT_X + GAP_XTRA,
  top: `calc(50% - (${FRAME_H}/2))`,
  width: `clamp(300px, 60vw, ${LEFT_W}px)`,
  height: FRAME_H,
  backgroundColor: BG,
  border: `1px solid ${DIM}`,
  borderRadius: 6,
  overflowY: 'hidden',
  overflowX: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',

  /* hover behaviour */
  '&:hover': {
    overflowY: 'auto'
  },
  '&:hover > div': {  
    animationPlayState: 'paused'
  },

  [theme.breakpoints.down('sm')]: {
    position: 'relative',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90vw',
    height: '60vh',
    opacity: 0.3
  }
}));

const FramesTrack = styled(Box)({
  width: '100%',
  height: '300%',
  display: 'flex',
  flexDirection: 'column',
  animation: `${scrollUp} 15s linear infinite`
});

/* height is now auto -> adapts to card */
const PromoFrame = styled(Box)({
  width: '100%',
  padding: 8,
  boxSizing: 'border-box'
});

const Connector = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: CONNECTOR_LEFT,
  top: `calc(50% - ${LINE_H / 2}px)`,
  width: LOGIN_GAP,
  height: LINE_H,
  backgroundColor: BG,
  border: `1px solid ${GLOW}`,
  [theme.breakpoints.down('xl')]: { display: 'none' }
}));

const Beacon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: CONNECTOR_LEFT - BEACON / 2,
  top: `calc(50% - ${BEACON / 2}px)`,
  width: BEACON,
  height: BEACON,
  borderRadius: '50%',
  backgroundColor: GLOW,
  animation: `${flicker} 1.5s ease-in-out infinite`,
  [theme.breakpoints.down('xl')]: { display: 'none' }
}));

const LoginBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: LOGIN_LEFT,
  top: '50%',
  transform: 'translateY(-50%)',
  width: LOGIN_W,
  backgroundColor: BG,
  border: `1px solid ${GLOW}`,
  borderRadius: 6,
  padding: 24,
  animation: `${flicker} 4s ease-in-out infinite`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: '#ccc',
  [theme.breakpoints.down('xl')]: {
    left: 'auto',
    right: '5vw',
    transform: 'translateY(-50%)'
  },
  [theme.breakpoints.down('sm')]: {
    left: '50%',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw'
  }
}));

const shuffleNoRepeat = (arr) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuffled.length; i++) {
    if (shuffled[i].kind === shuffled[i - 1].kind) {
      const j = shuffled.findIndex(
        (f, idx) => idx > i && f.kind !== shuffled[i].kind
      );
      if (j !== -1) [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  return shuffled;
};

export default function LoginPage() {
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getRandomAgentActivities();

        /* ---------- build cards ---------- */
        const gifFrames = res.freeGif.map((g) => ({
          kind: 'gif',
          card: (
            <Card sx={cardSx}>
              <CardHeader title={`Date created: ${formatDate(g.created_at)}`} />
              <CardMedia sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <ReactGifPlayer gif={g.link} autoplay style={{ width: '100%' }} />
              </CardMedia>
            </Card>
          )
        }));

        const shopFrames = res.agentShop.map((p) => ({
          kind: 'shop',
          card: (
            <Card sx={cardSx}>
              <CardHeader
                title={`Agent: ${p.agent_name}`}
                subheader={`Product: ${p.name} • Price: $${p.price}`}
              />
              <CardContent>
                <Typography variant="body2">Description: {p.description}</Typography>
              </CardContent>
            </Card>
          )
        }));

        const processFrames = res.processTable.map((pr) => ({
          kind: 'process',
          card: (
            <Card sx={cardSx}>
              <CardHeader
                title={`Agent: ${pr.agent_name}`}
                subheader={formatDate(pr.created_at)}
              />
              <CardContent>
                <Typography variant="body2">{pr.summary}</Typography>
              </CardContent>
            </Card>
          )
        }));

        const combined   = shuffleNoRepeat([
          ...gifFrames,
          ...shopFrames,
          ...processFrames
        ]);
        const allFrames  = [...combined, ...combined];

        setFrames(allFrames.length ? allFrames : [
          { kind: 'none', card: <Card sx={cardSx}>
            <CardContent>
                <Typography>No data</Typography></CardContent></Card> }
        ]);
      } catch (err) {
        console.error('Failed to get activities', err);
        setFrames([
          {
            kind: 'error',
            card: (
              <Card sx={cardSx}>
                <CardContent>
                  <Typography color="error">Could not load activities.</Typography>
                </CardContent>
              </Card>
            )
          }
        ]);
      }
    })();
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: BG
      }}
    >
      <LogoBox />

      <LeftFrame>
        <FramesTrack>
          {frames.map((f, idx) => (
            <PromoFrame key={idx}>{f.card}</PromoFrame>
          ))}
        </FramesTrack>
      </LeftFrame>
      <Connector />
      <Beacon />

      <LoginBox sx={{ display: { xs: 'none', sm: 'flex' } }}>
        <Typography sx={{ color: '#2e88bf', fontWeight: 'bold', mb: 2 }}>
          Login with:
        </Typography>
        <GoogleSignIn />
        <AppleSignIn />
        <Typography sx={{ fontSize: '0.85rem', color: '#555', mt: 2 }}>
          By signing up you agree to the Terms of Service and Privacy Policy,
          including Cookie Use.
        </Typography>
      </LoginBox>

      <LoginBox sx={{ display: { xs: 'flex', sm: 'none' } }}>
        <Typography sx={{ color: '#2e88bf', fontWeight: 'bold', mb: 2 }}>
          Continue with
        </Typography>
        <GoogleSignIn />
        <AppleSignIn />
        <Typography sx={{ fontSize: '0.85rem', color: '#555', mt: 2 }}>
          By signing up you agree to the Terms of Service and Privacy Policy,
          including Cookie Use.
        </Typography>
      </LoginBox>
    </Box>
  );
}
