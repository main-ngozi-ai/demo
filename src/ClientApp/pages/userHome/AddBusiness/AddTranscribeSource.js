import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Tabs, Tab, Button, Collapse, Grid, TextField, Typography, Card, CardContent,
  List, ListItemButton, Checkbox, InputAdornment, Divider, Autocomplete, Table,
  TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton, Pagination, Paper, Avatar,
  Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, FormControl, InputLabel, Select, LinearProgress,
  Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Autocomplete as MuiAutocomplete, RadioGroup, Radio, FormControlLabel, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SendIcon from '@mui/icons-material/Send';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';
import YouTubeMenu from './YouTubeMenu';
import './AddBusiness.css';
import {
  saveYoutubeData, getAllUserTranscribeData, getVideoData, getYoutubeChannelListsByCategory,
  quickYoutubeTranscribe, retryTranscribeVideo, deleteTranscribe, deleteChannelById,
  summarizeTranscribeApi, saveScrapValue, loadSavedAgent, getAgentChannels
} from '../../../../core/api/auth';

const parseSummary = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return raw;
  }
};

function containsHttpIncludes(text) {
  return text.includes("http://") || text.includes("https://");
}

const spinAnimation = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  animation: 'spin 1s linear infinite',
  color: 'orange',
  mr: 0.5
};

const YOUTUBE_MAIN_CATEGORIES = [
  { id: 1, name: 'Film & Animation' }, { id: 2, name: 'Autos & Vehicles' }, { id: 10, name: 'Music' },
  { id: 15, name: 'Pets & Animals' }, { id: 17, name: 'Sports' }, { id: 18, name: 'Short Movies' },
  { id: 19, name: 'Travel & Events' }, { id: 20, name: 'Gaming' }, { id: 21, name: 'Videoblogging' },
  { id: 22, name: 'People & Blogs' }, { id: 24, name: 'Entertainment' },
  { id: 25, name: 'News & Politics' }, { id: 26, name: 'Howto & Style' }, { id: 27, name: 'Education' },
  { id: 28, name: 'Science & Technology' }, { id: 29, name: 'Nonprofits & Activism' },
  { id: 30, name: 'Movies' }, { id: 31, name: 'Anime/Animation' }, { id: 32, name: 'Action/Adventure' },
  { id: 33, name: 'Classics' }, { id: 34, name: 'Comedy' }, { id: 35, name: 'Documentary' },
  { id: 36, name: 'Drama' }, { id: 37, name: 'Family' }, { id: 38, name: 'Foreign' },
  { id: 39, name: 'Horror' }, { id: 40, name: 'Sci-Fi/Fantasy' }, { id: 41, name: 'Thriller' },
  { id: 42, name: 'Shorts' }, { id: 43, name: 'Shows' }, { id: 44, name: 'Trailers' }
];

const RowActionsMenu = ({ rowTitle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <TableCell align="center">
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="primary">
        <ExpandMoreIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { console.log('ChatGPT for', rowTitle); setAnchorEl(null); }}>
          <ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="ChatGPT" />
        </MenuItem>
        <MenuItem onClick={() => { console.log('Edit', rowTitle); setAnchorEl(null); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem onClick={() => { console.log('View', rowTitle); setAnchorEl(null); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="View" />
        </MenuItem>
        <MenuItem onClick={() => { console.log('Delete', rowTitle); setAnchorEl(null); }}>
          <ListItemIcon><DeleteIcon color="error" fontSize="small" /></ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </TableCell>
  );
};

const AddTranscribeSource = ({user}) => {
  const userId = user?.id || localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('addBusiness');
  const [categories, setCategories] = useState({ uncategorized: true, design: true, development: false, writing: false, books: false });
  const [response, setResponse] = useState([]);
  const [transcribedData, setTranscribedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [saving, setSaving] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoDetailsLoading, setVideoDetailsLoading] = useState(false);
  const [videoDetailsData, setVideoDetailsData] = useState(null);
  const [summaryAnchorEl, setSummaryAnchorEl] = useState(null);
  const [summaryRow, setSummaryRow] = useState(null);
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [externalData, setExternalData] = useState([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [selectedExternalRows, setSelectedExternalRows] = useState([]);
  const [externalDeleteDialogOpen, setExternalDeleteDialogOpen] = useState(false);
  const [externalPage, setExternalPage] = useState(1);
  const EXTERNAL_PAGE_SIZE = 10;
  const [sections, setSections] = useState([{
    id: Date.now(),
    socialAccounts: [{
      id: Date.now(),
      accountName: '',
      platform: '',
      mainCategory: null,
      subCategories: [],
      transcribeMode: null,
      quickInput: '',
      selectedChannels: [],
      agentId: ''
    }]
  }]);
  const [filterChannel, setFilterChannel] = useState('All');
  const [filterReady, setFilterReady] = useState('All');
  const [filterSummarized, setFilterSummarized] = useState('All');
  const [transcribedAnchorEl, setTranscribedAnchorEl] = useState(null);
  const [transcribedRow, setTranscribedRow] = useState(null);
  const [newScrapUrl, setNewScrapUrl] = useState('');
  const [newScrapProtocol, setNewScrapProtocol] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [urlValid, setUrlValid] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [savedAgents, setSavedAgents] = useState([]);
  const [selectedSummarizeAgent, setSelectedSummarizeAgent] = useState('');
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [dialogSummaryRow, setDialogSummaryRow] = useState(null);
  const [summaryType, setSummaryType] = useState('long');

  const filterFormControlSx = {
    minWidth: 120,
    input: { color: '#fff' },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#fff !important'
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#fff !important'
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#fff !important'
    }
  };
  const inputSx = {
    backgroundColor: "#161d27",
    color: "#fff",
    input: { color: '#fff' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#444' },
      '&:hover fieldset': { borderColor: '#444' },
      '&.Mui-focused fieldset': { borderColor: '#444' }
    }
  };
  const inputLabelProps = { style: { color: '#fff' } };

  const formatValue = (key, value) => {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) {
        if (value.includes('T')) {
          const d = dayjs(value);
          if (d.isValid()) {
            return d.format('MMM D, YYYY h:mm A');
          }
        }
      }
      if (!isNaN(value)) {
        return Number(value).toLocaleString();
      }
    } else if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  const validateForm = () => {
    for (let section of sections) {
      for (let account of section.socialAccounts) {
        if (account.platform === 'youtube' && account.transcribeMode === 'jobs') {
          if (!account.mainCategory) {
            return "For YouTube jobs mode, a Main Category is required.";
          }
          if (!account.selectedChannels || account.selectedChannels.length === 0) {
            return "For YouTube jobs mode, select at least one channel.";
          }
          if (!account.agentId || account.agentId === "") {
            return "For YouTube jobs mode, please select an agent.";
          }
        }
        if (account.platform === 'youtube' && account.transcribeMode === 'quick') {
          const urlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
          if (!account.quickInput || !urlRegex.test(account.quickInput)) {
            return "Please enter a valid YouTube URL for quick transcribe.";
          }
        }
        if ((account.platform === 'twitter' || account.platform === 'web') &&
            (!account.accountName || account.accountName.trim() === "")) {
          return `Username is required for ${account.platform}.`;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agents = await loadSavedAgent(userId);
        setSavedAgents(Array.isArray(agents) ? agents : (agents ? [agents] : []));
      } catch (error) {
        console.error("Error loading saved agents", error);
      }
    };
    if (userId){
      fetchAgents();
    }
  }, []);

  useEffect(() => {
    const completeUrl = newScrapProtocol ? newScrapProtocol + newScrapUrl : newScrapUrl;
    if (newScrapUrl.trim() === '') {
      setUrlValid(false);
      setUrlError('');
      setIsValidating(false);
      return;
    }
    setIsValidating(true);
    const timer = setTimeout(() => {
      if (validateUrl(completeUrl)) {
        setUrlValid(true);
        setUrlError('');
      } else {
        setUrlValid(false);
        setUrlError('Invalid URL');
      }
      setIsValidating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [newScrapUrl, newScrapProtocol]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const getProtocol = (url) => {
    if (url.startsWith("https://")) return "https://";
    if (url.startsWith("http://")) return "http://";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setAlert({ severity: "error", message: error });
      return;
    }
    setAlert(null);
    setSaving(true);
    try {
      for (let sec of sections) {
        for (let a of sec.socialAccounts) {
          if (a.platform === 'youtube' && a.transcribeMode === 'jobs') {
            await saveYoutubeData({ channels: a.selectedChannels, agentId: a.agentId });
          }
        }
      }
      setServerResponse('Data saved successfully!');
      resetForm();
      setAlert({ severity: "success", message: "Data saved successfully!" });
    } catch (err) {
      console.error(err);
      setServerResponse('Error saving data');
      setAlert({ severity: "error", message: "Error saving data" });
    } finally {
      setSaving(false);
      setActiveTab('viewBusiness');
    }
  };

  const onQuickTranscribe = async () => {
    const account = sections[0].socialAccounts[0];
    const urlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    if (!account.quickInput || !urlRegex.test(account.quickInput)) {
      setAlert({ severity: "error", message: "Please enter a valid YouTube URL for quick transcribe." });
      return;
    }
    setAlert(null);
    setSaving(true);
    setTranscribeProgress(0);
    const progressInterval = setInterval(() => {
      setTranscribeProgress(prev => (prev >= 100 ? 100 : prev + 2));
    }, 100);
    try {
      await quickYoutubeTranscribe(account.quickInput, userId);
      setServerResponse('Quick transcribe successful!');
      setTranscribeProgress(100);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAlert({ severity: "success", message: "Quick transcribe successful!" });
      clearInterval(progressInterval);
    } catch (e) {
      setServerResponse('Error in quick transcribe');
      setAlert({ severity: "error", message: "Error in quick transcribe" });
      clearInterval(progressInterval);
    } finally {
      setSaving(false);
      resetForm();
      setActiveTab('viewBusiness');
    }
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  const confirmDelete = async () => {
    await deleteTranscribe(selectedRows);
    setAlert({ severity: "success", message: "Transcript deleted successfully!" });
    setTranscribedData(prev => prev.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    closeDeleteDialog();
  };

  const getAllExternalSources = async () => {
    try {
      setExternalLoading(true);
      const resp = await getAgentChannels(userId);
      const channels = resp.records || [];
      setExternalData(channels);
    } catch (e) {
      console.error(e);
    } finally {
      setExternalLoading(false);
    }
  };

  const handleExternalRefresh = () => {
    getAllExternalSources();
  };

  const deleteAgentChannel = async (id, channelId) => {
    try {
      await deleteChannelById(id, channelId);
      setExternalData(prev => prev.filter(channel => channel.channelId !== channelId));
      setAlert({ severity: "success", message: `Channel ${channelId} deleted successfully!` });
    } catch (e) {
      console.error(e);
      setAlert({ severity: "error", message: "Error deleting channel" });
    }
  };

  const openExternalDeleteDialog = () => {
    setExternalDeleteDialogOpen(true);
  };
  const closeExternalDeleteDialog = () => {
    setExternalDeleteDialogOpen(false);
  };

  const confirmExternalDelete = async () => {
    try {
        for (const row of selectedExternalRows) {
        const { id, channelId } = row;
        await deleteAgentChannel(id, channelId);
      }
      setSelectedExternalRows([]);
      setAlert({ severity: "success", message: "Selected channels deleted successfully!" });
    } catch (e) {
      console.error(e);
      setAlert({ severity: "error", message: "Error deleting channels" });
    }
    closeExternalDeleteDialog();
  };

  useEffect(() => {
    if (activeTab === 'viewBusiness') {
      getAllUserTranscribed();
    }
    if (activeTab === 'externalSource') {
      getAllExternalSources();
    }
  }, [activeTab]);

  const getVideoDetails = async (id) => {
    setVideoDetailsLoading(true);
    try {
      const resp = await getVideoData(id);
      const details = resp.result;
      setVideoDetailsData(Array.isArray(details) ? details : [details]);
    } catch (error) {
      console.error('Error fetching video details', error);
    } finally {
      setVideoDetailsLoading(false);
    }
  };

  const handleTranscribedMenuOpen = (event, row) => {
    setTranscribedAnchorEl(event.currentTarget);
    setTranscribedRow(row);
    getVideoDetails(row.id);
  };

  const handleSummaryMenuOpen = (event, row) => {
    setSummaryAnchorEl(event.currentTarget);
    setSummaryRow(row);
  };

  const retryTranscribe = async (id) => {
    try {
      setLoading(true);
      const resp = await retryTranscribeVideo(id);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAlert({ severity: "success", message: "Media sent for Transcribing!" });
      setTranscribedData(resp.result || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const summarizeVideo = async (id, agentId, summaryType) => {
    setTranscribedData(prev =>
      prev.map(row => row.id === id ? { ...row, transcript_summary: 'summarizing' } : row)
    );
    try {
      const resp = await summarizeTranscribeApi(id, agentId, summaryType);
      const newSummary = resp.result && resp.result.transcript_summary ? resp.result.transcript_summary : null;
      setTranscribedData(prev =>
        prev.map(row => row.id === id ? { ...row, transcript_summary: newSummary || row.transcript_summary } : row)
      );
      setAlert({ severity: "success", message: "Transcript sent for summarizing!" });
    } catch (error) {
      console.error('Error summarizing:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeDuplicatesAndSort = (channels) => {
    const map = new Map();
    channels.forEach(ch => {
      map.set(ch.channelId, ch);
    });
    const unique = Array.from(map.values());
    unique.sort((a, b) => Number(b.subscriberCount) - Number(a.subscriberCount));
    return unique;
  };

  const callPython = async (value) => {
    try {
      setChannelsLoading(true);
      const resp = await getYoutubeChannelListsByCategory(value);
      const resultArr = removeDuplicatesAndSort(resp.result.result || []);
      setResponse(resultArr);
    } catch (e) {
      console.error(e);
    } finally {
      setChannelsLoading(false);
    }
  };

  const getAllUserTranscribed = async () => {
    try {
      setLoading(true);
      const resp = await getAllUserTranscribeData(userId);
      setTranscribedData(resp.result || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => { getAllUserTranscribeData(userId); };

  const resetForm = () => {
    setCategories({ uncategorized: true, design: true, development: false, writing: false, books: false });
    setSections([{
      id: Date.now(),
      businessAddress: '',
      businessName: '',
      accountName: '',
      phoneNumber: '',
      google: false, yelp: false,
      socialAccounts: [{
        id: Date.now(),
        accountName: '',
        platform: '',
        mainCategory: null,
        subCategories: [],
        transcribeMode: null,
        quickInput: '',
        selectedChannels: [],
        agentId: ''
      }]
    }]);
    setSelectedRows([]);
    setTranscribeProgress(0);
    setNewScrapUrl('');
    setNewScrapProtocol('');
  };

  const getFalconsaiSummary = (s) => {
    if (!s) return '';
    try {
      const p = JSON.parse(s);
      return p.falconsai_text_summarization || '';
    } catch (e) {
      return '(Invalid JSON)';
    }
  };

  const truncatedText = (t, m = 20) =>
    (t.length <= m ? <span>{t}</span> : <span title={t}>{t.slice(0, m) + '...'}</span>);

  const channelOptions = useMemo(() => {
    const st = new Set();
    transcribedData.forEach(r => {
      if (r.youtube_channel_title) st.add(r.youtube_channel_title);
    });
    return Array.from(st);
  }, [transcribedData]);
  const channelOptionsWithAll = useMemo(() => ['All', ...channelOptions], [channelOptions]);

  const filteredData = useMemo(() => {
    return transcribedData.filter(r => {
      if (filterChannel !== 'All' && r.youtube_channel_title !== filterChannel) return false;
      const ready = r.state === 'Transcribed' || r.state === 'Scraped';
      if (filterReady === 'Yes' && !ready) return false;
      if (filterReady === 'No' && ready) return false;
      const sum = Boolean(getFalconsaiSummary(r.transcript_summary));
      if (filterSummarized === 'Yes' && !sum) return false;
      if (filterSummarized === 'No' && sum) return false;
      return true;
    });
  }, [transcribedData, filterChannel, filterReady, filterSummarized]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [filteredData]);
  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentTableData = sortedData.slice(startIndex, startIndex + PAGE_SIZE);

  const totalExternalPages = Math.ceil(externalData.length / EXTERNAL_PAGE_SIZE);
  const externalStartIndex = (externalPage - 1) * EXTERNAL_PAGE_SIZE;
  const currentExternalData = externalData.slice(externalStartIndex, externalStartIndex + EXTERNAL_PAGE_SIZE);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(sortedData.map(r => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  };

  const handleExternalSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedExternalRows(externalData.map(r => ({ id: r.id, channelId: r.channelId })));
    } else {
      setSelectedExternalRows([]);
    }
  };

  const handleExternalSelectRow = (id, channelId) => {
    setSelectedExternalRows(prevRows => {
      const exists = prevRows.some(item => item.channelId === channelId);
      if (exists) {
        return prevRows.filter(item => item.channelId !== channelId);
      } else {
        return [...prevRows, { id, channelId }];
      }
    });
  };
  

  const handlePageChange = (e, p) => setCurrentPage(p);
  const handleExternalPageChange = (e, p) => setExternalPage(p);

  const toggleYouTubeJobs = (sectionId, accountId) => {
    setSections(ps => ps.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        socialAccounts: s.socialAccounts.map(a => {
          if (a.id !== accountId) return a;
          return (a.platform === 'youtube' && a.transcribeMode === 'jobs')
            ? { ...a, platform: '', transcribeMode: null, agentId: '' }
            : { ...a, platform: 'youtube', transcribeMode: 'jobs' };
        })
      };
    }));
  };

  const toggleYouTubeQuick = (sectionId, accountId) => {
    setSections(ps => ps.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        socialAccounts: s.socialAccounts.map(a => {
          if (a.id !== accountId) return a;
          return (a.platform === 'youtube' && a.transcribeMode === 'quick')
            ? { ...a, platform: '', transcribeMode: null }
            : { ...a, platform: 'youtube', transcribeMode: 'quick' };
        })
      };
    }));
  };

  const toggleSocialPlatform = (sectionId, accountId, platform) => {
    setSections(ps => ps.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        socialAccounts: s.socialAccounts.map(a => {
          if (a.id !== accountId) return a;
          return a.platform === platform ? { ...a, platform: '', transcribeMode: null } : { ...a, platform };
        })
      };
    }));
  };

  const handleChannelSelect = (sectionId, accountId, channel) => {
    setSections(ps => ps.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        socialAccounts: sec.socialAccounts.map(a => {
          if (a.id !== accountId) return a;
          const selected = a.selectedChannels || [];
          const exists = selected.find(ch => ch.channelId === channel.channelId);
          return {
            ...a,
            selectedChannels: exists ? selected.filter(ch => ch.channelId !== channel.channelId) : [...selected, channel]
          };
        })
      };
    }));
  };

  const allowedKeys = ["view_count", "upload_date", "duration", "like_count", "comment_count", "px_def"];

  const renderVideoDetailsMenu = (
    <Menu
      anchorEl={transcribedAnchorEl}
      open={Boolean(transcribedAnchorEl)}
      onClose={() => { setTranscribedAnchorEl(null); setTranscribedRow(null); setVideoDetailsData(null); }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {videoDetailsLoading ? (
        <Box sx={{ p: 2 }}>
          <CircularProgress size={20} sx={{ color: '#fff' }} />
        </Box>
      ) : videoDetailsData && videoDetailsData.length > 0 ? (
        <Box
          sx={{
            p: 2,
            minWidth: '300px',
            maxWidth: '600px',
            backgroundColor: '#161d27',
            border: '1px solid #9b6008'
          }}
        >
          <TableContainer component={Paper} sx={{ backgroundColor: '#161d27', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {allowedKeys.map(key => (
                    <TableCell key={key} sx={{ fontWeight: 'bold', color: '#ccc' }}>
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {videoDetailsData.map((record, index) => (
                  <TableRow key={index}>
                    {allowedKeys.map(key => (
                      <TableCell key={key} sx={{ color: '#ccc' }}>
                        {formatValue(key, record[key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>No data</Box>
      )}
    </Menu>
  );

  const renderSummarizedMenu = (
    <Menu
      anchorEl={summaryAnchorEl}
      open={Boolean(summaryAnchorEl)}
      onClose={() => { setSummaryAnchorEl(null); setSummaryRow(null); }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {summaryRow ? (
        <Box sx={{ p: 2, minWidth: '200px', maxWidth: '300px', whiteSpace: 'pre-wrap' }}>
          {parseSummary(summaryRow.transcript_summary)}
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>No data</Box>
      )}
    </Menu>
  );

  const handleSaveChannels = async () => {
    const error = validateForm();
    if (error) {
      setAlert({ severity: "error", message: error });
      return;
    }
    setSaving(true);
    try {
      for (let sec of sections) {
        for (let a of sec.socialAccounts) {
          if (a.platform === 'youtube' && a.transcribeMode === 'jobs') {
            await saveYoutubeData(a.selectedChannels, a.agentId);
          }
        }
      }
      setAlert({ severity: "success", message: "Channels saved successfully!" });
      resetForm();
    } catch (err) {
      console.error(err);
      setAlert({ severity: "error", message: "Error saving channels" });
    } finally {
      setSaving(false);
    }
  };

  const handleScrap = async () => {
    const completeUrl = newScrapProtocol ? newScrapProtocol + newScrapUrl : newScrapUrl;
    if (!validateUrl(completeUrl)) {
      setAlert({ severity: "error", message: "Invalid URL. Please enter a valid URL with http:// or https://." });
      return;
    }
    setSaving(true);
    try {
      await saveScrapValue(completeUrl);
      setAlert({ severity: "success", message: `${completeUrl} sent successfully!` });
      resetForm();
    } catch (err) {
      console.error(err);
      setAlert({ severity: "error", message: "Error sending value" });
    } finally {
      setSaving(false);
    }
  };

  const renderStatusCell = (row) => {
    const state = row.state || '';
    if (state === 'Transcribed' || state === 'Scraped') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography component="span" sx={{ color: 'green', mr: 0.5 }}>
            {state}
          </Typography>
          <IconButton size="small" sx={{ p: 0 }} onClick={(e) => handleTranscribedMenuOpen(e, row)}>
            <ExpandMoreIcon sx={{ color: 'skyblue', transition: 'color 0.3s' }} />
          </IconButton>
        </Box>
      );
    } else if (state === 'Failed') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => retryTranscribe(row.id)}>
          <ReplayIcon sx={{ color: 'red', mr: 0.5 }} />
          <Typography component="span" sx={{ color: 'red' }}>
            {state}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutorenewIcon sx={spinAnimation} />
          <Typography component="span" sx={{ color: 'orange' }}>
            {state}
          </Typography>
        </Box>
      );
    }
  };

  const renderSummarizedCell = (row) => {
    if (!row.transcript) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography component="span">Not Ready</Typography>
        </Box>
      );
    }
    if (row.processed !== 1 && row.transcript_summary !== '' && row.transcript_summary === 'summarizing') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutorenewIcon sx={spinAnimation} />
          <Typography component="span" sx={{ color: 'orange', mr: 0.5 }}>
            Summarizing
          </Typography>
          <IconButton size="small" sx={{ p: 0 }} onClick={(e) => handleSummaryMenuOpen(e, row)}>
            <ExpandMoreIcon sx={{ color: 'skyblue', transition: 'color 0.3s' }} />
          </IconButton>
        </Box>
      );
    }
    if (row.transcript && row.transcript_summary === '') {
      return (
        <Button
          variant="text"
          size="small"
          onClick={() => {
            setDialogSummaryRow(row);
            setIsSummaryDialogOpen(true);
            setSummaryType('short');
          }}
          sx={{ textTransform: 'none', color: '#66ccff' }}
        >
        Not yet. Start? {'>>'}
        </Button>
      );
    }
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'green' }}>
        <Typography component="span" sx={{ mr: 0.5 }}>Yes</Typography>
        <IconButton size="small" sx={{ p: 0 }} onClick={(e) => handleSummaryMenuOpen(e, row)}>
          <ExpandMoreIcon sx={{ color: 'skyblue', transition: 'color 0.3s' }} />
        </IconButton>
      </Box>
    );
  };

  const showSaveChannels = sections.some(sec =>
    sec.socialAccounts.some(a => a.platform === 'youtube' && a.transcribeMode === 'jobs')
  );

  return (
    <Box
      className="main-content-container"
      sx={{
        p: 3,
        overflow: 'hidden',
        backgroundColor: '#161d27',
        color: '#ccc',
        minHeight: '100vh'
      }}
    >
      <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#ccc' }}>
          Agent Knowledge Base:
        </Typography>
      </Grid>
    </Grid>
      {alert && (
        <Box sx={{ mb: 2 }}>
          <Alert severity={alert.severity} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </Box>
      )}
      {renderVideoDetailsMenu}
      {renderSummarizedMenu}

      <Dialog
        open={isSummaryDialogOpen}
        onClose={() => {
          setIsSummaryDialogOpen(false);
          setDialogSummaryRow(null);
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#161d27',
            border: '1px solid #444',
            color: '#ccc'
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#161d27',
            borderBottom: '1px solid #444',
            color: '#ccc'
          }}
        >
          Summarize Text
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#161d27' }}>
          <DialogContentText sx={{ mb: 2, color: '#ccc' }}>
            Choose an Agent and type to summarize your text.
          </DialogContentText>
          <FormControl sx={{ minWidth: 120, mb: 2 }} size="small">
            <InputLabel id="select-agent-label" sx={{ color: '#fff' }}>
              Select Your Agent
            </InputLabel>
            <Select
              labelId="select-agent-label"
              label="Select Agent"
              value={selectedSummarizeAgent}
              onChange={(e) => setSelectedSummarizeAgent(e.target.value)}
              sx={{
                color: '#ccc',
                borderColor: '#444',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
              }}
            >
              {savedAgents.map(agent => (
                <MenuItem key={agent.id} value={agent.id}>{agent.model_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <RadioGroup
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            sx={{ mb: 2, color: '#ccc' }}
          >
            <FormControlLabel
              value="long"
              control={<Radio sx={{ color: '#ccc' }} />}
              label={
                <Tooltip title="Generates a comprehensive summary of the entire content">
                  <span style={{ color: '#ccc' }}>Long summary</span>
                </Tooltip>
              }
            />
            <FormControlLabel
              value="short"
              control={<Radio sx={{ color: '#ccc' }} />}
              label={
                <Tooltip title="Generates a shorter, more concise overview">
                  <span style={{ color: '#ccc' }}>Short summary</span>
                </Tooltip>
              }
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#161d27', borderTop: '1px solid #444' }}>
          <Button
            onClick={() => {
              setIsSummaryDialogOpen(false);
              setDialogSummaryRow(null);
            }}
            color="primary"
            startIcon={<CancelIcon />}
            sx={{
              textTransform: 'none',
              color: '#ccc',
              borderColor: '#444',
              '&:hover': { backgroundColor: '#333' }
            }}
          />
          <Button
            onClick={async () => {
              if (!dialogSummaryRow) return;
              setIsSummaryDialogOpen(false);
              const { id } = dialogSummaryRow;
              await summarizeVideo(id, selectedSummarizeAgent, summaryType);
              setDialogSummaryRow(null);
            }}
            color="secondary"
            startIcon={<SendIcon />}
            sx={{
              textTransform: 'none',
              color: '#ccc',
              borderColor: '#444',
              '&:hover': { backgroundColor: '#333' }
            }}
          />
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: '#444',
          mb: 3,
          backgroundColor: '#161d27',
          '& .MuiTabs-flexContainer button': { color: '#ccc' }
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Add Source" value="addBusiness" />
          <Tab label="Processed source" value="viewBusiness" />
          <Tab label="External source" value="externalSource" />
        </Tabs>
      </Box>

      {activeTab === 'addBusiness' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Card elevation={4} sx={{ p: 2, backgroundColor: '#161d27', color: '#ccc', border: '1px solid #444' }}>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {sections.map((section) => (
                    <Box key={section.id} sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#ccc' }}>
                        Sources:
                      </Typography>
                      {section.socialAccounts.map((account) => (
                        <Box key={account.id} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <YouTubeMenu
                                sx={{
                                  backgroundColor: '#161d27',
                                  borderColor: '#444',
                                  color: '#fff',
                                  textTransform: 'none'
                                }}
                                onAddChannelJobs={() => toggleYouTubeJobs(section.id, account.id)}
                                onQuickTranscribe={() => toggleYouTubeQuick(section.id, account.id)}
                              />
                              <Button
                                onClick={() => toggleSocialPlatform(section.id, account.id, 'twitter')}
                                sx={{
                                  backgroundColor: '#161d27',
                                  borderColor: '#444',
                                  color: '#fff',
                                  textTransform: 'none'
                                }}
                              >
                                <i className="fab fa-twitter" />
                              </Button>
                              <Button
                                onClick={() => toggleSocialPlatform(section.id, account.id, 'web')}
                                sx={{
                                  backgroundColor: '#161d27',
                                  borderColor: '#444',
                                  color: '#fff',
                                  textTransform: 'none'
                                }}
                              >
                                <LanguageIcon />
                              </Button>
                              {account.platform === 'youtube' && account.transcribeMode === 'jobs' && (
                                <FormControl variant="outlined"
                                 size="small" 
                                 sx={{
                                  ml: 1,
                                  width: 125,
                                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
                                }}>
                                  <InputLabel id={`agent-select-label-${account.id}`} sx={{ color: '#fff' }}>
                                    Agent
                                  </InputLabel>
                                  <Select
                                    labelId={`agent-select-label-${account.id}`}
                                    label="Agent"
                                    value={account.agentId || ''}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setSections(ps => ps.map(s => {
                                        if (s.id !== section.id) return s;
                                        return {
                                          ...s,
                                          socialAccounts: s.socialAccounts.map(a => 
                                            a.id === account.id ? { ...a, agentId: value } : a
                                          )
                                        };
                                      }));
                                    }}
                                    sx={{
                                      color: '#fff',
                                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
                                    }}
                                  >
                                    {savedAgents.map(agent => (
                                      <MenuItem key={agent.id} value={agent.id}>{agent.model_name}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Box>
                          </Box>
                          {account.platform === 'youtube' && account.transcribeMode === 'jobs' && (
                            <Collapse in timeout="auto" unmountOnExit>
                              <Box sx={{ mt: 2, border: '1px solid #444', p: 2, borderRadius: 1 }}>
                                <MuiAutocomplete
                                  options={YOUTUBE_MAIN_CATEGORIES}
                                  getOptionLabel={o => o.name}
                                  isOptionEqualToValue={(o, v) => o.id === v.id}
                                  value={YOUTUBE_MAIN_CATEGORIES.find(cat => cat.id === account.mainCategory) || null}
                                  onChange={(e, nv) => {
                                    if (!nv) return;
                                    setSections(ps => ps.map(s => s.id === section.id
                                      ? {
                                        ...s,
                                        socialAccounts: s.socialAccounts.map(a => 
                                          a.id === account.id ? { ...a, mainCategory: nv.id } : a
                                        )
                                      }
                                      : s
                                    ));
                                    callPython(nv.id);
                                  }}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label="Search Category"
                                      variant="outlined"
                                      sx={inputSx}
                                      InputLabelProps={inputLabelProps}
                                    />
                                  )}
                                  fullWidth
                                  sx={{ mb: 2 }}
                                />
                                {channelsLoading && (
                                  <Box sx={{ mb: 2 }}>
                                    <LinearProgress />
                                  </Box>
                                )}
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                  <Box flex={1} sx={{ border: '1px solid #333', p: 1, borderRadius: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      Choices ({response.length})
                                    </Typography>
                                    <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                      {response.map((ch) => {
                                        const isChosen = account.selectedChannels.some(sel => sel.channelId === ch.channelId);
                                        if (isChosen) return null;
                                        return (
                                          <ListItemButton
                                            key={ch.channelId}
                                            onClick={() => handleChannelSelect(section.id, account.id, ch)}
                                          >
                                            <ListItemIcon>
                                              <Checkbox edge="start" checked={false} tabIndex={-1} disableRipple />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={`${ch.channelTitle} | Sub Count: ${Number(ch.subscriberCount).toLocaleString()}`}
                                            />
                                          </ListItemButton>
                                        );
                                      })}
                                    </List>
                                  </Box>
                                  <Box flex={1} sx={{ border: '1px solid #333', p: 1, borderRadius: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      Chosen ({account.selectedChannels.length})
                                    </Typography>
                                    <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                      {account.selectedChannels.map((ch) => (
                                        <ListItemButton
                                          key={ch.channelId}
                                          onClick={() => handleChannelSelect(section.id, account.id, ch)}
                                        >
                                          <ListItemIcon>
                                            <Checkbox edge="start" checked tabIndex={-1} disableRipple />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={`${ch.channelTitle} (${Number(ch.subscriberCount).toLocaleString()})`}
                                          />
                                        </ListItemButton>
                                      ))}
                                    </List>
                                  </Box>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                      setSections(ps => ps.map(s => s.id === section.id
                                        ? {
                                          ...s,
                                          socialAccounts: s.socialAccounts.map(a => 
                                            a.id === account.id
                                              ? { ...a, platform: '', mainCategory: null, response: [], selectedChannels: [], agentId: '' }
                                              : a
                                          )
                                        }
                                        : s
                                      ));
                                    }}
                                    startIcon={<CancelIcon />}
                                    sx={{
                                      backgroundColor: '#161d27',
                                      borderColor: '#444',
                                      color: '#fff',
                                      textTransform: 'none'
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Collapse>
                          )}
                          {account.platform === 'youtube' && account.transcribeMode === 'quick' && (
                            <Collapse in timeout="auto" unmountOnExit>
                              <Box sx={{ mt: 2, border: '1px solid #444', p: 2, borderRadius: 1 }}>
                                <TextField
                                  label="YouTube URL"
                                  value={account.quickInput || ''}
                                  onChange={(e) => {
                                    setSections(ps => ps.map(s => s.id === section.id
                                      ? {
                                        ...s,
                                        socialAccounts: s.socialAccounts.map(a => a.id === account.id
                                          ? { ...a, quickInput: e.target.value }
                                          : a)
                                      }
                                      : s
                                    ));
                                  }}
                                  fullWidth
                                  variant="outlined"
                                  InputLabelProps={inputLabelProps}
                                  sx={{ mb: 2, backgroundColor: "#161d27", ...filterFormControlSx }}
                                />
                                {saving && (
                                  <>
                                    <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
                                      Processing...
                                    </Typography>
                                    <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                                      <LinearProgress variant="determinate" value={transcribeProgress} sx={{ height: '10px' }} />
                                    </Box>
                                  </>
                                )}
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                      setSections(ps => ps.map(s => s.id === section.id
                                        ? {
                                          ...s,
                                          socialAccounts: s.socialAccounts.map(a => a.id === account.id
                                            ? { ...a, transcribeMode: null, quickInput: '', platform: 'other' }
                                            : a)
                                        }
                                        : s
                                      ));
                                    }}
                                    startIcon={<CancelIcon />}
                                    sx={{
                                      backgroundColor: '#161d27',
                                      borderColor: '#444',
                                      color: '#fff',
                                      textTransform: 'none'
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onQuickTranscribe}
                                    disabled={saving}
                                    startIcon={<SendIcon />}
                                    sx={{
                                      backgroundColor: '#161d27',
                                      borderColor: '#444',
                                      color: '#fff',
                                      textTransform: 'none'
                                    }}
                                  >
                                    {saving
                                      ? <CircularProgress size={24} sx={{ backgroundColor: '#161d27', borderColor: '#444', color: '#fff' }} />
                                      : 'Transcribe'
                                    }
                                  </Button>
                                </Box>
                              </Box>
                            </Collapse>
                          )}
                          {(account.platform === 'twitter' || account.platform === 'web') && (
                            <Collapse in timeout="auto" unmountOnExit>
                              <Box sx={{ mt: 2, border: '1px solid #444', p: 2, borderRadius: 1 }}>
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  label={
                                    account.platform === "web"
                                      ? account.platform.charAt(0).toUpperCase() + account.platform.slice(1) + " URL"
                                      : account.platform === "twitter"
                                        ? account.platform.charAt(0).toUpperCase() + account.platform.slice(1) + " Username"
                                        : account.platform.charAt(0).toUpperCase() + account.platform.slice(1)
                                  }
                                  value={newScrapProtocol ? newScrapProtocol + newScrapUrl : newScrapUrl}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.startsWith("https://")) {
                                      setNewScrapProtocol("https://");
                                      setNewScrapUrl(val.substring("https://".length));
                                    } else if (val.startsWith("http://")) {
                                      setNewScrapProtocol("http://");
                                      setNewScrapUrl(val.substring("http://".length));
                                    } else {
                                      setNewScrapProtocol("");
                                      setNewScrapUrl(val);
                                    }
                                  }}
                                  InputLabelProps={inputLabelProps}
                                  sx={{ mb: 2, backgroundColor: "#161d27", ...filterFormControlSx }}
                                  error={Boolean(urlError)}
                                  helperText={urlError}
                                  InputProps={{
                                    startAdornment: newScrapProtocol ? (
                                      <InputAdornment position="start">
                                        <span style={{ color: 'green' }}>{newScrapProtocol}</span>
                                      </InputAdornment>
                                    ) : null,
                                    endAdornment: isValidating && (
                                      <InputAdornment position="end">
                                        <CircularProgress size={20} />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                      setSections(ps => ps.map(s => s.id === section.id
                                        ? {
                                          ...s,
                                          socialAccounts: s.socialAccounts.map(a => a.id === account.id
                                            ? { ...a, platform: 'other', accountName: '' }
                                            : a)
                                        }
                                        : s
                                      ));
                                    }}
                                    startIcon={<CancelIcon />}
                                    sx={{
                                      backgroundColor: '#161d27',
                                      borderColor: '#444',
                                      color: '#fff',
                                      textTransform: 'none'
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleScrap}
                                    startIcon={<FileCopyIcon />}
                                    sx={{
                                      backgroundColor: '#161d27',
                                      borderColor: '#444',
                                      color: '#fff',
                                      textTransform: 'none'
                                    }}
                                  >
                                    Scrap
                                  </Button>
                                </Box>
                              </Box>
                            </Collapse>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ))}
                  {showSaveChannels && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{
                          backgroundColor: '#161d27',
                          borderColor: '#444',
                          color: '#fff',
                          textTransform: 'none'
                        }}
                        startIcon={<CancelIcon />}
                        onClick={resetForm}
                      />
                      <Button
                        variant="outlined"
                        color="secondary"
                        disabled={saving}
                        sx={{
                          backgroundColor: '#161d27',
                          borderColor: '#444',
                          color: '#fff',
                          textTransform: 'none'
                        }}
                        onClick={handleSaveChannels}
                      >
                        {saving ? <CircularProgress size={20} sx={{ backgroundColor: '#161d27', borderColor: '#444', color: '#fff' }} /> : 'Save channels'}
                      </Button>
                    </Box>
                  )}
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 'viewBusiness' && (
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'space-between',
              mb: 3
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ccc' }}>
              Knowledge Source
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <IconButton onClick={handleRefresh} color="primary">
                <ReplayIcon />
              </IconButton>
              <IconButton onClick={openDeleteDialog} color="error" disabled={selectedRows.length === 0}>
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <MuiAutocomplete
                options={channelOptionsWithAll}
                value={filterChannel}
                sx={{ minWidth: 128 }}
                onChange={(e, v) => setFilterChannel(v || 'All')}
                renderInput={(p) => (
                  <TextField
                    {...p}
                    label="Channel"
                    variant="outlined"
                    InputLabelProps={inputLabelProps}
                    sx={filterFormControlSx}
                  />
                )}
              />
              <FormControl variant="outlined" sx={filterFormControlSx}>
                <InputLabel id="filter-ready-label" sx={{ color: '#fff' }}>
                  Ready
                </InputLabel>
                <Select
                  labelId="filter-ready-label"
                  value={filterReady}
                  onChange={(e) => setFilterReady(e.target.value)}
                  label="Not Ready"
                  sx={{ color: '#fff' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={filterFormControlSx}>
                <InputLabel id="filter-summarized-label" sx={{ color: '#fff' }}>
                  Summarized
                </InputLabel>
                <Select
                  labelId="filter-summarized-label"
                  value={filterSummarized}
                  onChange={(e) => setFilterSummarized(e.target.value)}
                  label="Not Summarized"
                  sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ backgroundColor: '#161d27', borderColor: '#444', color: '#fff' }}/>
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  overflowX: 'auto',
                  backgroundColor: '#161d27',
                  border: '1px solid #444',
                  '& td, & th': { py: '2px', lineHeight: '1.1rem', color: '#ccc', backgroundColor: '#161d27' }
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedRows.length > 0 && selectedRows.length < sortedData.length}
                          checked={sortedData.length > 0 && selectedRows.length === sortedData.length}
                          onChange={handleSelectAll}
                          sx={{ color: '#ccc' }}
                        />
                      </TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Summarized?</TableCell>
                      <TableCell>Video/Page Title</TableCell>
                      <TableCell>Channel/Website</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Source Type</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Date Uploaded</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentTableData.map((row, idx) => {
                      const falconsSummary = getFalconsaiSummary(row.transcript_summary);
                      const isSummarized = Boolean(falconsSummary);
                      const bgColor = isSummarized && idx % 2 === 0 ? '#262626' : isSummarized ? '#161d27' : '#202020';
                      return (
                        <TableRow key={row.id} sx={{ backgroundColor: bgColor }}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows.includes(row.id)}
                              onChange={() => handleSelectRow(row.id)}
                              sx={{ color: '#ccc' }}
                              disabled={!(row.state === "Failed" || row.state === "Transcribed" || row.state === "Scraped")}
                            />
                          </TableCell>
                          <TableCell>
                            {renderStatusCell(row)}
                          </TableCell>
                          <TableCell>
                            {renderSummarizedCell(row)}
                          </TableCell>
                          <TableCell>
                            <Link to={`/transcribed/${row.id}`} style={{ textDecoration: 'none', color: '#66ccff' }}>
                              {truncatedText(row.transcript_title)}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {row.channel_logo_url ? (
                                <Avatar src={row.channel_logo_url} alt={row.youtube_channel_title} sx={{ width: 24, height: 24, mr: 1 }} />
                              ) : (
                                <YouTubeIcon sx={{ color: 'red', mr: 1 }} />
                              )}
                              {truncatedText(
                                containsHttpIncludes(row.youtube_channel_id) ? row.youtube_channel_id : row.youtube_channel_title,
                                35
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            {row.video_id ? "YouTube" : "Web"}
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            {row.createdAt ? dayjs(row.createdAt).format('MMM D, YYYY h:mm A') : ''}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!currentTableData.length && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">No records found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2, color: '#fff', '& .MuiPaginationItem-root': { color: '#fff' } }}
              >
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  Showing {startIndex + 1}–{startIndex + currentTableData.length} of {sortedData.length}
                </Typography>
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
              </Box>
            </>
          )}
        </Box>
      )}

      {activeTab === 'externalSource' && (
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ccc' }}>
              External Source
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleExternalRefresh} color="primary">
                <ReplayIcon />
              </IconButton>
              <IconButton onClick={openExternalDeleteDialog} color="error" disabled={selectedExternalRows.length === 0}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          {externalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ backgroundColor: '#161d27', borderColor: '#444', color: '#fff' }}/>
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  overflowX: 'auto',
                  backgroundColor: '#161d27',
                  border: '1px solid #444',
                  '& td, & th': { py: '2px', lineHeight: '1.1rem', color: '#ccc', backgroundColor: '#161d27' }
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedExternalRows.length > 0 && selectedExternalRows.length < externalData.length}
                          checked={externalData.length > 0 && selectedExternalRows.length === externalData.length}
                          onChange={handleExternalSelectAll}
                          sx={{ color: '#ccc' }}
                        />
                      </TableCell>
                      <TableCell>Channel Title</TableCell>
                      <TableCell>Subscriber Count</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Agent Attached</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentExternalData.map((row) => (
                      <TableRow key={row.channelId}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedExternalRows.includes(row.channelId)}
                            onChange={() => handleExternalSelectRow(row.id, row.channelId)}
                            sx={{ color: '#ccc' }}
                          />
                        </TableCell>
                        <TableCell>{row.channelTitle}</TableCell>
                        <TableCell>{Number(row.subscriberCount).toLocaleString()}</TableCell>
                        <TableCell>
                          {truncatedText(row.description, 40)}
                        </TableCell>
                        <TableCell>{row.model_name ? row.model_name : "None"}</TableCell>
                      </TableRow>
                    ))}
                    {externalData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No records found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2, color: '#fff', '& .MuiPaginationItem-root': { color: '#fff' } }}
              >
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  Showing {externalStartIndex + 1}–{externalStartIndex + currentExternalData.length} of {externalData.length}
                </Typography>
                <Pagination count={totalExternalPages} page={externalPage} onChange={handleExternalPageChange} color="primary" />
              </Box>
            </>
          )}
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#161d27',
            border: '1px solid #444',
            color: '#ccc'
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#161d27',
            borderBottom: '1px solid #444',
            color: '#ccc'
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#161d27' }}>
          <DialogContentText sx={{ color: '#ccc' }}>
            Are you sure you want to delete {selectedRows.length} selected record(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#161d27', borderTop: '1px solid #444' }}>
          <Button
            onClick={closeDeleteDialog}
            color="primary"
            startIcon={<CancelIcon />}
            sx={{
              textTransform: 'none',
              color: '#ccc',
              borderColor: '#444',
              '&:hover': { backgroundColor: '#333' }
            }}
          />
          <Button
            onClick={confirmDelete}
            color="secondary"
            startIcon={<CheckCircleIcon />}
            sx={{
              textTransform: 'none',
              color: '#ccc',
              borderColor: '#444',
              '&:hover': { backgroundColor: '#333' }
            }}
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={externalDeleteDialogOpen}
        onClose={closeExternalDeleteDialog}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#161d27',
            border: '1px solid #444',
            color: '#ccc'
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#161d27',
            borderBottom: '1px solid #444',
            color: '#ccc'
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#161d27' }}>
          <DialogContentText sx={{ color: '#ccc' }}>
            Are you sure you want to delete {selectedExternalRows.length} selected record(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#161d27', borderTop: '1px solid #444' }}>
          <Button
            onClick={closeExternalDeleteDialog}
            color="primary"
            startIcon={<CancelIcon />}
            sx={{
              textTransform: 'none',
              color: '#ccc',
              borderColor: '#444',
              '&:hover': { backgroundColor: '#333' }
            }}
          />
          <Button
            onClick={confirmExternalDelete}
            color="secondary"
            startIcon={<CheckCircleIcon />}
            sx={{
              textTransform: 'none',
              color: '#ccc',
              borderColor: '#444',
              '&:hover': { backgroundColor: '#333' }
            }}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddTranscribeSource;
