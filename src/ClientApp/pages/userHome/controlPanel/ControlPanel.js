import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Checkbox,
  Grid
} from '@mui/material';

import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildIcon from '@mui/icons-material/Build';
import RepeatIcon from '@mui/icons-material/Repeat';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; 
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete'; 

import {
  getAgents,
  saveAgentControl,
  getActions,
  loadAgentAction,
  deleteAgentAction,
  getSelectedAgent,
  deleteAgentById
} from '../../../../core/api/auth';

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

const ControlPanel = ({user}) => {
  const userId = user?.id || localStorage.getItem('userId');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [selectedAgentChatGptId, setSelectedAgentChatGptId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [tabIndex, setTabIndex] = useState(0);

  const [timeValue, setTimeValue] = useState(dayjs());
  const [editingTime, setEditingTime] = useState(false);

  const [editingOccurrence, setEditingOccurrence] = useState(false);
  const [currentOccurrence, setCurrentOccurrence] = useState('everyday');
  const sampleOccurrences = [
    { id: 'everyday', label: 'Everyday' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'custom', label: 'Custom' }
  ];

  const [allActions, setAllActions] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);
  const [filterText, setFilterText] = useState('');

  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionsErrorMsg, setActionsErrorMsg] = useState('');

  const [occurrenceAC, setOccurrenceAC] = useState('');
  const [timeOfDayAC, setTimeOfDayAC] = useState('');
  const [createdAtAC, setCreatedAtAC] = useState('');
  const [groupedActiveControl, setGroupedActiveControl] = useState({});
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [enableCommunication, setEnableCommunication] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [deleteAgentDialogOpen, setDeleteAgentDialogOpen] = useState(false);

  const inputSx = {
    backgroundColor: '#161d27',
    color: '#fff',
    input: { color: '#fff' },

    '& .MuiInputLabel-root': {
      color: '#ccc'
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#ccc'
    },

    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#444' },
      '&:hover fieldset': { borderColor: '#444' },
      '&.Mui-focused fieldset': { borderColor: '#444' }
    }
  };

  useEffect(() => {
    if (userId){
      fetchAgentList();
      fetchActionsList();
    }
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadAgentActionsFromServer(selectedAgent);
    }
  }, [tabIndex, selectedAgent]);

  async function fetchAgentList() {
    try {
      setLoadingAgents(true);
      const resp = await getAgents(userId);
      setAgents(resp.data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setErrorMsg('Error fetching agents from server.');
    } finally {
      setLoadingAgents(false);
    }
  }

  const getSelectedAgentDetails = async (id) => {
    try {
      const resp = await getSelectedAgent(id);
      return resp ? resp.properties : null;
    } catch (err) {
      console.error('Error fetching Agent details:', err);
      return null;
    }
  };

  async function fetchActionsList() {
    try {
      const resp = await getActions();
      if (resp && resp.result) {
        setAllActions(resp.result);
      }
    } catch (error) {
      console.error('Error fetching actions:', error);
      setErrorMsg('Error fetching actions from server.');
    }
  }

  async function loadAgentActionsFromServer(agentId) {
    try {
      setErrorMsg('');
      setSuccessMsg('');

      const resp = await loadAgentAction(agentId);
      const rawData = resp.data || {};
      const rawActions = rawData.actions || [];

      setOccurrenceAC(rawData.occurance || '');
      setTimeOfDayAC(rawData.time_of_day || '');
      setCreatedAtAC(rawData.created_at || '');

      const grouped = {};
      rawActions.forEach((item) => {
        const key = item.unique_id || 'ungrouped';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });
      setGroupedActiveControl(grouped);
      setSelectedGroups([]);
    } catch (err) {
      console.error('Error loading agent actions:', err);
      setErrorMsg('Error loading agent actions from server');
    }
  }

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  const handleTimeEditClick = () => {
    setEditingTime(true);
  };
  const handleTimeChange = (newVal) => {
    setTimeValue(newVal);
  };
  const closeTimePicker = () => {
    setEditingTime(false);
  };

  const handleOccurrenceChange = (e) => {
    setCurrentOccurrence(e.target.value);
  };
  const handleOccurrenceFinish = () => {
    setEditingOccurrence(false);
  };

  const handleActionViewClick = () => {
    setActionDialogOpen(true);
  };
  const handleActionClose = () => {
    setActionDialogOpen(false);
    setFilterText('');
    setActionsErrorMsg('');
  };

  const filteredActions = allActions.filter((action) =>
    action.actions.toLowerCase().includes(filterText.toLowerCase())
  );

  const groupedActions = filteredActions.reduce((acc, actionObj) => {
    const groupId = actionObj.unique_id || 'ungrouped';
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(actionObj);
    return acc;
  }, {});

  function getDistinctSelectedGroups() {
    const groupSet = new Set();
    for (let act of allActions) {
      if (selectedActions.includes(act.id)) {
        groupSet.add(act.unique_id || 'ungrouped');
      }
    }
    return groupSet;
  }

  function handleToggleGroup(actionsInGroup, groupId) {
    setActionsErrorMsg('');
    const allSelected = actionsInGroup.every((act) => selectedActions.includes(act.id));
    if (!allSelected) {
      // user wants to add
      const distinctGroups = getDistinctSelectedGroups();
      if (!distinctGroups.has(groupId) && distinctGroups.size >= 3) {
        setActionsErrorMsg('You can only select up to 3 groups of actions per agent.');
        return;
      }
      const groupIds = actionsInGroup.map((act) => act.id);
      setSelectedActions((prev) => {
        const newSet = new Set(prev);
        groupIds.forEach((id) => newSet.add(id));
        return Array.from(newSet);
      });
    } else {
      // remove
      const groupIds = actionsInGroup.map((act) => act.id);
      setSelectedActions((prev) => prev.filter((id) => !groupIds.includes(id)));
    }
  }

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhoneNumber(val);
    const phoneRegex = /^[+()\-.\s\d]{7,}$/;
    if (val && !phoneRegex.test(val)) {
      setPhoneError('Invalid phone format (min 7 chars, digits/spaces/()+-.).');
    } else {
      setPhoneError('');
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      setEmailError('Invalid email format.');
    } else {
      setEmailError('');
    }
  };

  function validateForm() {
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedAgent) {
      setErrorMsg('Please select an agent first.');
      return false;
    }
    if (!timeValue || !timeValue.isValid()) {
      setErrorMsg('Please choose a valid time.');
      return false;
    }
    if (!selectedActions.length) {
      setErrorMsg('Please select at least one action.');
      return false;
    }

    if (enableCommunication) {
      if (!phoneNumber.trim() && !email.trim()) {
        setErrorMsg(
          'Please fill phone number and/or email if you want to receive text/email from your agents.'
        );
        return false;
      }
      if (phoneError || emailError) {
        setErrorMsg('Please fix phone/email errors before saving.');
        return false;
      }
    }
    return true;
  }

  const handleSave = async () => {
    if (!validateForm()) return;

    const groupIdsSet = getDistinctSelectedGroups();
    const groupIds = Array.from(groupIdsSet);

    const timeStr = timeValue.format('hh:mm A');

    const dataToSave = {
      agent_id: selectedAgent,
      timeOfDay: timeStr,
      actions: selectedActions,
      groupIds,
      occurance: currentOccurrence
    };

    if (enableCommunication) {
      dataToSave.phone_number = phoneNumber;
      dataToSave.email = email;
    }

    try {
      setSuccessMsg('');
      await saveAgentControl(dataToSave);
      setSuccessMsg('Data saved successfully!');
      setErrorMsg('');
    } catch (err) {
      console.error('Error saving agent control:', err);
      setErrorMsg('Failed to save. Please check your settings.');
    }
  };

  const handleCancel = () => {
    setTimeValue(dayjs());
    setSelectedActions([]);
    setEditingTime(false);
    setEditingOccurrence(false);
    setCurrentOccurrence('everyday');
    setEnableCommunication(false);
    setPhoneNumber('');
    setEmail('');
    setPhoneError('');
    setEmailError('');
    setErrorMsg('');
    console.log('User canceled changes => revert to defaults');
  };

  const handleAgentChange = async (e) => {
    const id = e.target.value;
    setSelectedAgent(id);
    setSelectedAgentChatGptId('');
    const details = await getSelectedAgentDetails(id);
    setSelectedAgentChatGptId(details?.chat_gpt_id);
  };

  const handleDeleteAgentClick = () => {
    if (selectedAgent) {
      setDeleteAgentDialogOpen(true);
    }
  };

  const handleConfirmDeleteAgent = async () => {
    setDeleteAgentDialogOpen(false);
    try {
      await deleteAgentById(selectedAgent, userId);
      setSuccessMsg('Agent deleted successfully!');
      setSelectedAgent('');
      setSelectedAgentChatGptId('');
      setGroupedActiveControl({});
    } catch (err) {
      console.error('Error deleting agent:', err);
      setErrorMsg('Failed to delete agent.');
    }
  };

  function getLabelsForUserActions() {
    if (!selectedActions.length) {
      return '(No actions selected)';
    }
    const foundLabels = [];
    allActions.forEach((act) => {
      if (selectedActions.includes(act.id)) {
        foundLabels.push(act.actions);
      }
    });
    return foundLabels.length ? foundLabels.join(', ') : '(No actions selected)';
  }

  function getOccurrenceLabel(id) {
    const found = sampleOccurrences.find((o) => o.id === id);
    return found ? found.label : '(Unknown)';
  }

  const handleToggleActiveGroup = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
    );
  };

  function handleDeleteSelectedGroups() {
    if (!selectedGroups.length) {
      setErrorMsg('No group(s) selected to delete.');
      return;
    }
    setDeleteDialogOpen(true);
  }

  async function confirmDeleteGroups() {
    setDeleteDialogOpen(false);

    try {
      let allSuccess = true;
      for (const gId of selectedGroups) {
        const resp = await deleteAgentAction(selectedAgent, gId, userId);
        if (resp.success) {
          const updated = { ...groupedActiveControl };
          delete updated[gId];
          setGroupedActiveControl(updated);
        } else {
          allSuccess = false;
        }
      }

      if (allSuccess) {
        setSuccessMsg('Selected group(s) deleted successfully!');
      } else {
        setErrorMsg('One or more groups could not be deleted.');
      }
      setSelectedGroups([]);
    } catch (err) {
      console.error('Error deleting groups:', err);
      setErrorMsg('Failed to delete group(s).');
    }
  }

  return (
    <Box sx={mainContainerSx}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#ccc' }}>
              Agent Control:
            </Typography>
          </Grid>
        </Grid>
      <Card sx={cardSx}>
        <CardContent>
          {successMsg && (
            <Alert
              severity="success"
              sx={{ mb: 2, backgroundColor: '#1d2620', color: 'green' }}
              onClose={() => setSuccessMsg('')}
            >
              {successMsg}
            </Alert>
          )}
          {errorMsg && (
            <Alert
              severity="error"
              sx={{ mb: 2, backgroundColor: '#261d1d', color: 'red' }}
              onClose={() => setErrorMsg('')}
            >
              {errorMsg}
            </Alert>
          )}

          {/* AGENT SELECT */}
          <Card
            sx={{
              backgroundColor: '#161d27',
              border: '1px solid #444',
              color: '#ccc',
              mb: 2
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mr: 1, color: '#ccc' }}>
                  Agents:
                </Typography>
                <FormControl
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 160 }}
                  disabled={loadingAgents || !!errorMsg}
                >
                  <InputLabel sx={{ color: '#ccc' }}>Select Agent</InputLabel>
                  <Select
                    label="Select Agent"
                    value={selectedAgent}
                    onChange={handleAgentChange}
                    sx={{
                      color: '#ccc',
                      md: 2,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
                    }}
                  >
                    {agents.map((agent, idx) => (
                      <MenuItem key={`${agent.agent_id}-${idx}`} value={agent.agent_id}>
                        {agent.model_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedAgentChatGptId && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      Agent ID: {selectedAgentChatGptId}
                    </Typography>
                    <IconButton
                      onClick={() => navigator.clipboard.writeText(selectedAgentChatGptId)}
                      sx={{ ml: 1 }}
                    >
                      <FileCopyIcon sx={{ color: '#ccc' }} />
                    </IconButton>
                  </Box>
                )}

                {/* Delete Agent Icon */}
                <IconButton
                  onClick={handleDeleteAgentClick}
                  disabled={!selectedAgent}
                  sx={{ ml: 2, color: '#ff4444', border: '1px solid #444' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>

          {/* TABS */}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: '#66ccff' } }}
            sx={{
              mb: 2,
              borderBottom: '1px solid #444',
              '.MuiTab-root': {
                textTransform: 'none'
              }
            }}
          >
            <Tab label="Active Control" />
            <Tab label="Change Control" />
          </Tabs>

          {/* TAB 0: ACTIVE CONTROL */}
          {tabIndex === 0 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#ccc' }}>
                  Active Control:
                </Typography>
                {Object.keys(groupedActiveControl).length > 0 && (
                  <IconButton
                    onClick={handleDeleteSelectedGroups}
                    disabled={!selectedGroups.length}
                    sx={{ color: '#ff4444', border: '1px solid #444' }}
                  >
                    {/* Delete Action Groups Icon */}
                    <DeleteForeverIcon />
                  </IconButton>
                )}
              </Box>

              <Box
                sx={{
                  mt: 2,
                  mb: 2,
                  p: 1.5,
                  backgroundColor: '#161d27',
                  border: '1px solid #444'
                }}
              >
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                  <strong>Occurence:</strong>{' '}
                  <span style={{ color: '#FF9800' }}>
                    {occurrenceAC || '(none)'}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                  <strong>Time of Day:</strong>{' '}
                  <span style={{ color: '#FF9800' }}>
                    {timeOfDayAC ? timeOfDayAC : '(none)'}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  <strong>Created At:</strong>{' '}
                  <span style={{ color: '#FF9800' }}>
                    {createdAtAC
                      ? dayjs(createdAtAC).format('MMM D, YYYY h:mm A')
                      : '(none)'}
                  </span>
                </Typography>
              </Box>

              {Object.keys(groupedActiveControl).length === 0 ? (
                <Typography sx={{ color: '#999' }}>
                  No existing actions found for this agent.
                </Typography>
              ) : (
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: '#161d27',
                    border: '1px solid #444'
                  }}
                >
                  {Object.entries(groupedActiveControl).map(([groupId, actionsArr]) => {
                    const isSelected = selectedGroups.includes(groupId);
                    const joinedActions = actionsArr.map((act) => act.actions).join(', ');

                    return (
                      <Box
                        key={groupId}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#ccc', mr: 2 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleToggleActiveGroup(groupId)}
                            sx={{ color: '#66ccff' }}
                          />
                          <strong>Actions:</strong>{' '}
                          <span style={{ color: '#FF9800' }}>{joinedActions}</span>
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {/* TAB 1: CHANGE CONTROL */}
          {tabIndex === 1 && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#161d27',
                  border: '1px solid #444',
                  color: '#ccc',
                  p: 2
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ borderBottom: '1px solid #444', pb: 1, mb: 2, color: '#ccc' }}
                >
                  Control Panel:
                </Typography>

                {/* TIME */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderBottom: '1px solid #444'
                  }}
                >
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography sx={{ color: '#ccc', mr: 1 }}>Time of day:</Typography>
                  <IconButton
                    onClick={handleTimeEditClick}
                    sx={{ color: '#ccc', mr: 2 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <Typography sx={{ color: '#FF9800', mr: 'auto' }}>
                    {timeValue.format('h:mm A')}
                  </Typography>
                </Box>

                {/* ACTIONS */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderBottom: '1px solid #444'
                  }}
                >
                  <BuildIcon sx={{ mr: 1 }} />
                  <Typography sx={{ color: '#ccc', mr: 1 }}>Action(s):</Typography>
                  <IconButton
                    onClick={handleActionViewClick}
                    sx={{ color: '#ccc', mr: 2 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <Typography sx={{ color: '#FF9800', mr: 'auto' }}>
                    {getLabelsForUserActions()}
                  </Typography>
                </Box>

                {/* OCCURRENCE */}
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <RepeatIcon sx={{ mr: 1 }} />
                  <Typography sx={{ color: '#ccc', mr: 1 }}>Occurrence:</Typography>
                  {!editingOccurrence ? (
                    <>
                      <IconButton
                        onClick={() => setEditingOccurrence(true)}
                        sx={{ color: '#ccc', mr: 2 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <Typography sx={{ color: '#FF9800', mr: 'auto' }}>
                        {getOccurrenceLabel(currentOccurrence)}
                      </Typography>
                    </>
                  ) : (
                    <FormControl
                      size="small"
                      variant="outlined"
                      sx={{
                        mr: 'auto',
                        minWidth: 140,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
                      }}
                    >
                      <Select
                        value={currentOccurrence}
                        onChange={handleOccurrenceChange}
                        onClose={handleOccurrenceFinish}
                        sx={{
                          color: '#FF9800',
                          backgroundColor: '#161d27'
                        }}
                      >
                        {sampleOccurrences.map((occ) => (
                          <MenuItem key={occ.id} value={occ.id}>
                            {occ.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>

                {/* COMMUNICATION CHECKBOX */}
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <Checkbox
                    checked={enableCommunication}
                    onChange={(e) => setEnableCommunication(e.target.checked)}
                    sx={{ color: '#66ccff' }}
                  />
                  <Typography sx={{ color: '#ccc', mr: 1 }}>
                    Receive text/email from your agent?
                  </Typography>
                </Box>

                {enableCommunication && (
                  <Box
                    sx={{
                      p: 1,
                      ml: 4,
                      borderLeft: '2px solid #444',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}
                  >
                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      error={Boolean(phoneError)}
                      helperText={phoneError || ''}
                      sx={inputSx}
                    />
                    Or
                    <TextField
                      label="Email"
                      variant="outlined"
                      value={email}
                      onChange={handleEmailChange}
                      error={Boolean(emailError)}
                      helperText={emailError || ''}
                      sx={inputSx}
                    />
                  </Box>
                )}

                {/* CANCEL & SAVE */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* TIME PICKER DIALOG */}
      {editingTime && (
        <Dialog open={editingTime} onClose={closeTimePicker}>
          <DialogTitle sx={{ backgroundColor: '#161d27', color: '#ccc' }}>
            Select Time
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: '#161d27', color: '#ccc' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={timeValue}
                onChange={handleTimeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      mt: 2,
                      input: { color: '#fff' },
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#161d27',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
                      },
                      '& .MuiInputBase-input': {
                        color: '#ccc'
                      }
                    }}
                  />
                )}
                PopperProps={{
                  sx: {
                    '& .MuiPaper-root': {
                      backgroundColor: '#161d27',
                      color: '#ccc',
                      border: '1px solid #444'
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#161d27', color: '#ccc' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={closeTimePicker}
              sx={{ textTransform: 'none', color: '#ccc', borderColor: '#444' }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={closeTimePicker}
              sx={{ textTransform: 'none', color: '#ccc', borderColor: '#444' }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* ACTIONS DIALOG */}
      <Dialog
        open={actionDialogOpen}
        onClose={handleActionClose}
        PaperProps={{
          sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>
          Manage Actions
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            You may select up to 3 groups of actions total. Use the filter to narrow down the list,
            and click “Add All” or “Remove All” to manage each group.
          </Typography>

          {actionsErrorMsg && (
            <Alert
              severity="error"
              sx={{ mb: 2, backgroundColor: '#261d1d', color: 'red' }}
              onClose={() => setActionsErrorMsg('')}
            >
              {actionsErrorMsg}
            </Alert>
          )}

          {/* Filter text field */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Filter actions..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{
                flex: 1,
                input: { color: '#fff' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                '& .MuiInputBase-input': { color: '#ccc' }
              }}
            />
          </Box>

          {/* Table-like grouping */}
          {Object.entries(groupedActions).map(([groupId, actionsInGroup]) => {
            const allSelected = actionsInGroup.every((act) => selectedActions.includes(act.id));
            return (
              <Box key={groupId} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #444',
                    alignItems: 'center',
                    pb: 1,
                    mb: 1
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#ccc' }}>
                    Group: <strong>{groupId}</strong>
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={allSelected ? <CancelIcon /> : <SaveIcon />}
                    onClick={() => handleToggleGroup(actionsInGroup, groupId)}
                    sx={{
                      color: '#ccc',
                      borderColor: '#444',
                      textTransform: 'none'
                    }}
                  >
                    {allSelected ? 'Remove All' : 'Add All'}
                  </Button>
                </Box>

                {actionsInGroup.map((act) => (
                  <Box
                    key={act.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid #444',
                      py: 1
                    }}
                  >
                    <Typography sx={{ color: '#ccc' }}>{act.actions}</Typography>
                  </Box>
                ))}
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleActionClose}
            sx={{ textTransform: 'none', color: '#ccc', borderColor: '#444' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE GROUPS DIALOG (Active Control) */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedGroups.length} selected group(s)?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#ccc', borderColor: '#444' }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteForeverIcon />}
            onClick={confirmDeleteGroups}
            color="error"
            sx={{ textTransform: 'none', color: '#ccc', borderColor: '#444' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE AGENT DIALOG */}
      <Dialog
        open={deleteAgentDialogOpen}
        onClose={() => setDeleteAgentDialogOpen(false)}
        PaperProps={{
          sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>
          Delete Agent?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the currently selected agent? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => setDeleteAgentDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#ccc', borderColor: '#444' }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleConfirmDeleteAgent}
            color="error"
            sx={{ textTransform: 'none', color: '#ccc', borderColor: '#444' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ControlPanel;
