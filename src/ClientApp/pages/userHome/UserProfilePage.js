import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button,
  CardActions,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { grey } from '@mui/material/colors';
import UserAvatar from '../../../assets/default-avatar.png';

const UserProfilePage = () => {
  const rawUrl = localStorage.getItem('photoURL') || '';
  const displayName = localStorage.getItem('displayName') || '';

  let photo = rawUrl.match(/=s\d+-c$/)
  ? rawUrl.replace(/=s\d+-c$/, '?sz=96')
  : rawUrl;

  const avatarSrc = (photo && photo.startsWith('http'))
  ? photo 
  : UserAvatar;

  return (
    <Box sx={{ backgroundColor: '#161d27', minHeight: '100vh', color: '#ccc', py: 2 }}>
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        {/* Page Header */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#ccc' }}>
              Account:
            </Typography>
          </Grid>
        </Grid>

        {/* Profile Card */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#161d27', border: '1px solid #444' }}>
              <CardHeader
                sx={{
                  textAlign: 'center',
                  borderBottom: '1px solid #444',
                  pb: 1
                }}
                avatar={
                  <Box sx={{ mx: 'auto' }}>
                    <img
                      src={avatarSrc}
                      alt="User Avatar"
                      style={{ width: 110, height: 110, borderRadius: '50%' }}
                    />
                  </Box>
                }
                title={
                  <Typography variant="h5" sx={{ color: '#ccc', mt: 1 }}>
                    {displayName}
                  </Typography>
                }
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: grey[500] }}>
                    Workload
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      backgroundColor: '#444',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: '74%',
                        backgroundColor: '#1976d2',
                        p: 0.5,
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#fff' }}>
                        74%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PersonAddIcon />}
                  sx={{ borderColor: '#ccc', color: '#ccc' }}
                >
                 Add Credit
                </Button>
              </CardActions>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ borderColor: '#ccc', color: '#ccc' }}
                >
                  Deactivate Account
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
