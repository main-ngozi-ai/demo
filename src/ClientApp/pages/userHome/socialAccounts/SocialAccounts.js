import React, { useState, useEffect } from 'react';
import {
  Box,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Avatar,
  Autocomplete
} from '@mui/material';

import TwitterIcon     from '@mui/icons-material/Twitter';
import FacebookIcon    from '@mui/icons-material/Facebook';
import InstagramIcon   from '@mui/icons-material/Instagram';
import MusicNoteIcon   from '@mui/icons-material/MusicNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon      from '@mui/icons-material/Cancel';
import LinkIcon        from '@mui/icons-material/Link';
import EditIcon        from '@mui/icons-material/Edit';

import {
  getAgentDetails,
  getAgentConfigExist,
  getUserSourceType,
  getCharacter,
  getLanguageModels
} from '../../../../core/api/auth';


const socialBaseUrls = {
  twitter:   'https://twitter.com/',
  facebook:  'https://facebook.com/',
  instagram: 'https://instagram.com/',
  tiktok:    'https://tiktok.com/@'
};

const mainContainerSx = {
  p: 2,
  backgroundColor: '#161d27',
  color: '#ccc',
  minHeight: '100vh'
};
const cardSx = {
  backgroundColor: '#161d27',
  border: '1px solid #444',
  color: '#ccc',
  mb: 2
};
const formControlSx = {
  mb: 2,
  mr: 2,
  minWidth: 200,
  '& .MuiOutlinedInput-root': {
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444', borderWidth: '1px' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
  },
  '& .MuiFormLabel-root': { color: '#ccc' }
};
const textFieldSx = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444', borderWidth: '1px' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
  },
  '& .MuiFormLabel-root': { color: '#ccc' },
  '& .MuiInputBase-input': { color: '#ccc' }
};


const getSelectedAgentDetails = async (id) => {
  try {
    const { result } = await getAgentDetails(id);
    return result ? result.properties : null;
  } catch (err) {
    console.error('Error fetching Agent details:', err);
    return null;
  }
};

const checkIfPostConfigExistsAndSave = async (
  agentId,
  source,
  secondary,
  activePeriod,
  configPayload,
  userId
) => {
  try {
    const resp = await getAgentConfigExist(
      userId,
      agentId,
      source,
      secondary,
      activePeriod,
      configPayload
    );
    return !resp.exist;
  } catch (err) {
    console.error('Error checking config existence:', err);
    return false;
  }
};


const SocialAccounts = ({ user }) => {
  const userId = user?.id || localStorage.getItem('userId');

  const [selectedAgentId, setSelectedAgentId]    = useState(null);
  const [modelList, setModelList]                = useState([]);
  const [agentProps, setAgentProps]              = useState(null);
  const [loadingAgent, setLoadingAgent]          = useState(false);

  const [selectedSource, setSelectedSource]      = useState('');
  const [currentSecondaries, setCurrentSecondaries] = useState([]);
  const [selectedSecondary, setSelectedSecondary]   = useState('');
  const [activePeriod, setActivePeriod]              = useState('');
  const [loadingSource, setLoadingSource]            = useState(false);

  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [behavioralOptions, setBehavioralOptions]   = useState([]);
  const [languageOptions, setLanguageOptions]       = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languageError, setLanguageError]       = useState(false);

  const [languageModelOptions, setLanguageModelOptions] = useState([]);
  const [selectedLangModel, setSelectedLangModel]       = useState('');
  const [langModelError,   setLangModelError]           = useState(false);

  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    facebook: '',
    instagram: '',
    tiktok: ''
  });

  const [addLater, setAddLater] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkPlatform, setLinkPlatform] = useState('');
  const [linkUsername, setLinkUsername] = useState('');
  const [linkPassword, setLinkPassword] = useState('');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [availableDescriptions, setAvailableDescriptions] = useState([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [availableBehaviorals, setAvailableBehaviorals] = useState([]);
  const [selectedBehaviorals, setSelectedBehaviorals] = useState([]);
  const [customDescriptions, setCustomDescriptions] = useState([]);
  const [customBehaviorals, setCustomBehaviorals] = useState([]);


  useEffect(() => {
    const fetchInitialLists = async () => {
      try {
        const {
          result = [],
          descriptionOptions: descOpts = [],
          behavioralOptions:  behOpts  = [],
          languageOptions:    langOpts = []
        } = (await getCharacter()) || {};

        const models = result.map((r) => r.properties);
        setModelList(models);
        setDescriptionOptions(descOpts);
        setBehavioralOptions(behOpts);
        setLanguageOptions(langOpts);

        const lmResp = await getLanguageModels();
        const names = Array.isArray(lmResp)
          ? [...new Set(lmResp.map((m) => (typeof m === 'string' ? m : m.name)))]
          : [];
        setLanguageModelOptions(names);

        if (models.length) {
          const { model_id } = models[0];
          setSelectedAgentId(model_id);
          handleAgentChange(model_id, models);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    fetchInitialLists();
  }, []);


  const resetForm = () => {
    setSelectedAgentId(null);
    setAgentProps(null);
    setSelectedSource('');
    setSelectedSecondary('');
    setActivePeriod('');
    setCurrentSecondaries([]);
    setSelectedLanguage('');
    setLanguageError(false);
    setSelectedLangModel('');
    setLangModelError(false);
    setSocialLinks({ twitter: '', facebook: '', instagram: '', tiktok: '' });
    setAddLater(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAgentChange = async (id, existingModels = modelList) => {
    setSelectedAgentId(id);
    const m = existingModels.find((x) => x.model_id === id);
    setSelectedAvatar(
      m ? `https://ui-avatars.com/api/?name=${encodeURIComponent(m.model_name)}` : ''
    );
    if (!id) {
      setAgentProps(null);
      return;
    }
    setLoadingAgent(true);
    setAgentProps(await getSelectedAgentDetails(id));
    setLoadingAgent(false);
  };

  const handleSourceChange = async (src) => {
    setSelectedSource(src);
    setSelectedSecondary('');
    setCurrentSecondaries([]);
    if (!src) return;
    try {
      setLoadingSource(true);
      const resp = await getUserSourceType(src, userId);
      setCurrentSecondaries(Array.isArray(resp.data) ? resp.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSource(false);
    }
  };

  const handleLinkClick   = (platform) => { setLinkPlatform(platform); setDialogOpen(true); };
  const handleUnlink      = (platform) => setSocialLinks((p) => ({ ...p, [platform]: '' }));
  const handleDialogClose = () => {
    setDialogOpen(false);
    setLinkPlatform('');
    setLinkUsername('');
    setLinkPassword('');
  };
  const handleLinkSubmit = () => {
    if (!linkUsername.trim() || !linkPassword.trim()) return;
    setSocialLinks((prev) => ({
      ...prev,
      [linkPlatform]: socialBaseUrls[linkPlatform] + linkUsername
    }));
    handleDialogClose();
  };

  const moveItem = (item, fromSetter, toSetter) => {
    fromSetter((prev) => prev.filter((x) => x !== item));
    toSetter((prev) => [...prev, item]);
  };
  const handleDragStart = (e, item, type) =>
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, type }));
  const allowDrop = (e) => e.preventDefault();
  const handleDrop = (e, targetType, target, source) => {
    e.preventDefault();
    const { item, type } = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (type !== targetType) return;
    if (source.current.includes(item)) moveItem(item, source.setter, target.setter);
  };


  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedAgentId) {
      setErrorMsg('Agent selection is required.');
      return;
    }
    if (!selectedLanguage) {
      setLanguageError(true);
      setErrorMsg('Delivery language is required.');
      return;
    }
    if (!selectedLangModel) {
      setLangModelError(true);
      setErrorMsg('Language‑model selection is required.');
      return;
    }

    if (!addLater) {
      if (!selectedSource) {
        setErrorMsg('Source is required.');
        return;
      }
      if (!selectedSecondary) {
        setErrorMsg('Secondary source is required.');
        return;
      }
      if (!activePeriod) {
        setErrorMsg('Active period is required.');
        return;
      }
    }

    const payload = JSON.stringify({
      ...socialLinks,
      avatar: selectedAvatar,
      language: selectedLanguage,
      language_model: selectedLangModel,
      additionalDescriptions: customDescriptions,
      additionalBehaviorals: customBehaviorals
    });

    const proceed = await checkIfPostConfigExistsAndSave(
      selectedAgentId,
      addLater ? '0' : selectedSource,
      addLater ? '0' : selectedSecondary,
      addLater ? '0' : activePeriod,
      payload,
      userId
    );

    if (!proceed) {
      setErrorMsg('This post configuration already exists!');
      return;
    }
    setSuccessMsg('Saved successfully.');
    resetForm();
  };


  return (
    <Box sx={mainContainerSx}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#ccc' }}>
            Create Agent:
          </Typography>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle sx={{ color: '#ccc' }}>Link {linkPlatform} Account</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            sx={textFieldSx}
            value={linkUsername}
            onChange={(e) => setLinkUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            sx={textFieldSx}
            value={linkPassword}
            onChange={(e) => setLinkPassword(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            startIcon={<CancelIcon sx={{ color: '#ccc' }} />}
            sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleLinkSubmit}
            startIcon={<LinkIcon sx={{ color: '#ccc' }} />}
            sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
          >
            Link
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle sx={{ color: '#ccc' }}>Edit Additional Attributes</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#ccc' }}>
            Edit Reasoning
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ color: '#ccc' }}>Available</Typography>
              <Box
                sx={{ border: '1px solid #444', minHeight: 150, p: 1 }}
                onDragOver={allowDrop}
                onDrop={(e) =>
                  handleDrop(
                    e,
                    'description',
                    { current: selectedDescriptions, setter: setSelectedDescriptions },
                    { current: availableDescriptions, setter: setAvailableDescriptions }
                  )
                }
              >
                {availableDescriptions.map((item) => (
                  <Box
                    key={item}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'description')}
                    onClick={() => moveItem(item, setAvailableDescriptions, setSelectedDescriptions)}
                    sx={{ p: 1, border: '1px solid #444', mb: 1, cursor: 'pointer', color: '#ccc' }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ color: '#ccc' }}>Selected</Typography>
              <Box
                sx={{ border: '1px solid #444', minHeight: 150, p: 1 }}
                onDragOver={allowDrop}
                onDrop={(e) =>
                  handleDrop(
                    e,
                    'description',
                    { current: availableDescriptions, setter: setAvailableDescriptions },
                    { current: selectedDescriptions, setter: setSelectedDescriptions }
                  )
                }
              >
                {selectedDescriptions.map((item) => (
                  <Box
                    key={item}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'description')}
                    onClick={() => moveItem(item, setSelectedDescriptions, setAvailableDescriptions)}
                    sx={{ p: 1, border: '1px solid #444', mb: 1, cursor: 'pointer', color: '#ccc' }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#ccc' }}>
            Edit Behavioral
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ color: '#ccc' }}>Available</Typography>
              <Box
                sx={{ border: '1px solid #444', minHeight: 150, p: 1 }}
                onDragOver={allowDrop}
                onDrop={(e) =>
                  handleDrop(
                    e,
                    'behavioral',
                    { current: selectedBehaviorals, setter: setSelectedBehaviorals },
                    { current: availableBehaviorals, setter: setAvailableBehaviorals }
                  )
                }
              >
                {availableBehaviorals.map((item) => (
                  <Box
                    key={item}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'behavioral')}
                    onClick={() => moveItem(item, setAvailableBehaviorals, setSelectedBehaviorals)}
                    sx={{ p: 1, border: '1px solid #444', mb: 1, cursor: 'pointer', color: '#ccc' }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ color: '#ccc' }}>Selected</Typography>
              <Box
                sx={{ border: '1px solid #444', minHeight: 150, p: 1 }}
                onDragOver={allowDrop}
                onDrop={(e) =>
                  handleDrop(
                    e,
                    'behavioral',
                    { current: availableBehaviorals, setter: setAvailableBehaviorals },
                    { current: selectedBehaviorals, setter: setSelectedBehaviorals }
                  )
                }
              >
                {selectedBehaviorals.map((item) => (
                  <Box
                    key={item}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'behavioral')}
                    onClick={() => moveItem(item, setSelectedBehaviorals, setAvailableBehaviorals)}
                    sx={{ p: 1, border: '1px solid #444', mb: 1, cursor: 'pointer', color: '#ccc' }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<CancelIcon sx={{ color: '#ccc' }} />}
            onClick={() => setEditDialogOpen(false)}
            sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<CheckCircleIcon sx={{ color: '#ccc' }} />}
            onClick={() => {
              setCustomDescriptions(selectedDescriptions);
              setCustomBehaviorals(selectedBehaviorals);
              setEditDialogOpen(false);
            }}
            sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={cardSx}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#ccc' }}>
            Social Accounts:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, overflowX: 'auto' }}>
            {['twitter', 'facebook', 'instagram', 'tiktok'].map((platform) => {
              const linked = Boolean(socialLinks[platform]);
              return (
                <Box
                  key={platform}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 1,
                    p: 1,
                    minWidth: 150
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {platform === 'twitter'   && <TwitterIcon  sx={{ color: '#1DA1F2' }} />}
                    {platform === 'facebook'  && <FacebookIcon sx={{ color: '#1877F2' }} />}
                    {platform === 'instagram' && <InstagramIcon sx={{ color: '#E1306C' }} />}
                    {platform === 'tiktok'    && <MusicNoteIcon sx={{ color: 'magenta' }} />}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, color: linked ? 'lime' : 'orange' }}>
                    {linked ? 'Linked' : 'Not Linked'}
                  </Typography>
                  {linked ? (
                    <Button
                      variant="outlined"
                      sx={{ mt: 1, textTransform: 'none', borderColor: '#444', color: '#ccc' }}
                      onClick={() => handleUnlink(platform)}
                    >
                      Unlink
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      sx={{ mt: 1, textTransform: 'none', borderColor: '#444', color: '#ccc' }}
                      onClick={() => handleLinkClick(platform)}
                    >
                      Link Account
                    </Button>
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Box>

      <Box sx={cardSx}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#ccc' }}>
            Select character:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar src={selectedAvatar} alt="Character Avatar" sx={{ width: 80, height: 80 }} />
              </Box>

              <FormControl sx={formControlSx}>
                <InputLabel sx={{ color: '#ccc' }}>Character</InputLabel>
                <Select
                  sx={{ color: '#ccc' }}
                  value={selectedAgentId || ''}
                  onChange={(e) => handleAgentChange(Number(e.target.value))}
                  label="Character"
                >
                  <MenuItem value="">Choose a Character</MenuItem>
                  {modelList.map((a) => (
                    <MenuItem key={a.model_id} value={a.model_id}>
                      {a.model_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={formControlSx} error={langModelError}>
                <InputLabel sx={{ color: '#ccc' }}>Language Model</InputLabel>
                <Select
                  sx={{ color: '#ccc' }}
                  value={selectedLangModel}
                  onChange={(e) => {
                    setSelectedLangModel(e.target.value);
                    setLangModelError(false);
                  }}
                  label="Language Model"
                >
                  <MenuItem value="">Choose a model</MenuItem>
                  {languageModelOptions.map((lm) => (
                    <MenuItem key={lm} value={lm}>
                      {lm}
                    </MenuItem>
                  ))}
                </Select>
                {langModelError && (
                  <FormHelperText sx={{ color: 'red' }}>Required</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 2,
                border: '1px solid #444',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Autocomplete
                options={languageOptions ?? []}
                value={selectedLanguage}
                onChange={(_, newVal) => {
                  setSelectedLanguage(newVal || '');
                  setLanguageError(false);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Delivery Language"
                    sx={textFieldSx}
                    error={languageError}
                    helperText={languageError ? 'Required' : ''}
                  />
                )}
                filterSelectedOptions
                fullWidth
              />

              {loadingAgent ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#ccc' }} />
                  <Typography sx={{ color: '#ccc' }}>Loading character details…</Typography>
                </Box>
              ) : agentProps ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                      Trait:&nbsp;<span style={{ color: '#fff' }}>{agentProps.trait}</span>
                    </Typography>
                    <IconButton
                      sx={{ color: '#ccc' }}
                      onClick={() => {
                        setAvailableDescriptions(
                          descriptionOptions.filter((x) => !customDescriptions.includes(x))
                        );
                        setSelectedDescriptions(customDescriptions);
                        setAvailableBehaviorals(
                          behavioralOptions.filter((x) => !customBehaviorals.includes(x))
                        );
                        setSelectedBehaviorals(customBehaviorals);
                        setEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                    Reasoning:&nbsp;<span style={{ color: '#fff' }}>{agentProps.description}</span>
                  </Typography>
                  {customDescriptions.length > 0 && (
                    <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                      Additional Descriptions:&nbsp;
                      <span style={{ color: '#fff' }}>{customDescriptions.join(', ')}</span>
                    </Typography>
                  )}
                  <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                    Behavioral:&nbsp;
                    <span style={{ color: '#fff' }}>{agentProps.behavioral_manifestation}</span>
                  </Typography>
                  {customBehaviorals.length > 0 && (
                    <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                      Additional Behavioral:&nbsp;
                      <span style={{ color: '#fff' }}>{customBehaviorals.join(', ')}</span>
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body2" sx={{ color: '#999' }}>
                  No agent selected
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Box>

      <Box sx={cardSx}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#ccc' }}>
              Configure Post Settings:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addLater}
                  onChange={(e) => {
                    setAddLater(e.target.checked);
                    if (e.target.checked) {
                      setSelectedSource('0');
                      setSelectedSecondary('0');
                      setActivePeriod('0');
                    } else {
                      setSelectedSource('');
                      setSelectedSecondary('');
                      setActivePeriod('');
                    }
                  }}
                  sx={{ color: '#ccc' }}
                />
              }
              label="Add later"
              sx={{ color: '#ccc' }}
            />
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: '#261d1d', color: 'red' }}>
              {errorMsg}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" sx={{ mb: 2, backgroundColor: '#1d2620', color: 'lime' }}>
              {successMsg}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={formControlSx}>
              <InputLabel sx={{ color: '#ccc' }}>Source</InputLabel>
              <Select
                sx={{ color: '#ccc' }}
                value={selectedSource}
                onChange={(e) => handleSourceChange(e.target.value)}
                label="Source"
                disabled={addLater}
              >
                <MenuItem value="">Select a source</MenuItem>
                <MenuItem value="YouTube">YouTube</MenuItem>
                <MenuItem value="Url">Url</MenuItem>
                <MenuItem value="Twitter">Twitter</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={formControlSx} disabled={addLater || loadingSource || !selectedSource}>
              <InputLabel sx={{ color: '#ccc' }}>Secondary Source</InputLabel>
              <Select
                sx={{ color: '#ccc' }}
                value={selectedSecondary}
                onChange={(e) => setSelectedSecondary(e.target.value)}
                label="Secondary Source"
              >
                <MenuItem value="">Select secondary</MenuItem>
                {currentSecondaries.map((sec) => (
                  <MenuItem key={sec.id} value={sec.id}>
                    {sec.transcript_title || JSON.stringify(sec)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={formControlSx}>
              <InputLabel sx={{ color: '#ccc' }}>Active Period</InputLabel>
              <Select
                sx={{ color: '#ccc' }}
                value={activePeriod}
                onChange={(e) => setActivePeriod(e.target.value)}
                label="Active Period"
                disabled={addLater}
              >
                <MenuItem value="">Select period</MenuItem>
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="afternoon">Afternoon</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
                <MenuItem value="night">Night</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loadingSource && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <CircularProgress size={20} sx={{ color: '#ccc' }} />
              <Typography sx={{ color: '#ccc' }}>Retrieving source data…</Typography>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon sx={{ color: '#ccc' }} />}
              onClick={resetForm}
              sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              startIcon={<CheckCircleIcon sx={{ color: '#ccc' }} />}
              onClick={handleSave}
              sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
            >
              Save
            </Button>
          </Box>
        </CardContent>
      </Box>
    </Box>
  );
};

export default SocialAccounts;
