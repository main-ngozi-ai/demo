import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  Chip,
} from '@mui/material';
import { UserContext } from '../login/UserContext';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import GifIcon from '@mui/icons-material/Gif';
import AnimationIcon from '@mui/icons-material/Animation';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

// ---- Import the GIF player library only once
import ReactGifPlayer from 'react-gif-player';

import {
  loadSavedAgent,
  getAgentChartData,
  getYoutubeVideoDetails,
  makeFreeYoutubeVideoGif,
  checkGifResult,
} from '../../../core/api/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Layout styles
const containerSx = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  backgroundColor: '#161d27',
  color: '#ccc',
  overflow: 'hidden',
};

const framesContainerSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const frameSx = {
  flex: 1,
  overflowY: 'auto',
  p: 2,
  boxSizing: 'border-box',
};

const cardSx = {
  backgroundColor: '#161d27',
  border: '1px solid #444',
  color: '#ccc',
  mb: 2,
};

const selectSx = {
  color: '#ccc',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
};

const toggleLabelSx = { mr: 3, color: '#ccc' };

// Helper to format processed time (e.g. "0725" → "7 min 25 sec")
const formatProcessedTime = (timeStr) => {
  if (timeStr.length === 4) {
    const minutes = parseInt(timeStr.slice(0, 2), 10);
    const seconds = parseInt(timeStr.slice(2), 10);
    return `${minutes} min ${seconds} sec`;
  }
  return timeStr;
};

const isValidYouTubeUrl = (url) => {
  if (!url.trim()) return false;
  const regExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return regExp.test(url.trim());
};

const truncateTitle = (title) => {
  const words = title.split(/\s+/);
  return words.length <= 20 ? title : words.slice(0, 20).join(' ');
};

const parseYouTubeDuration = (iso) => {
  let hours = 0, minutes = 0, seconds = 0;
  const hourMatch = iso.match(/(\d+)H/);
  if (hourMatch) hours = parseInt(hourMatch[1], 10);
  const minuteMatch = iso.match(/(\d+)M/);
  if (minuteMatch) minutes = parseInt(minuteMatch[1], 10);
  const secondMatch = iso.match(/(\d+)S/);
  if (secondMatch) seconds = parseInt(secondMatch[1], 10);
  const display = hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
  const totalSec = hours * 3600 + minutes * 60 + seconds;
  return { display, totalSec };
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function limitWords(str, maxWords) {
  if (!str) return '';
  const words = str.split(/\s+/);
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : str;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userId = user?.id;
  const [agents, setAgents] = useState([]);
  const [selectedAgentActions, setSelectedAgentActions] = useState('');
  const [toggles, setToggles] = useState({
    summaries: false,
    socialMedia: false,
    shops: false,
    products: false,
    sells: false,
  });
  const [chartData, setChartData] = useState({
    summaries: [],
    socialMedia: [],
    shops: [],
    products: [],
    sells: [],
  });

  const [videoLink, setVideoLink] = useState('');
  const [activePlaygroundMenu, setActivePlaygroundMenu] = useState('');
  const [gifTime, setGifTime] = useState('');
  const [gifTimeError, setGifTimeError] = useState(false);
  const [gifTimeHelperText, setGifTimeHelperText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gifUrl, setGifUrl] = useState('');
  const [videoLinkError, setVideoLinkError] = useState(false);
  const [videoLinkHelperText, setVideoLinkHelperText] = useState('');
  const [videoDetails, setVideoDetails] = useState(null);

  // Processed GIFs table state
  const [processedGifs, setProcessedGifs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Tab state: 0 for Input, 1 for Results
  const [activeTab, setActiveTab] = useState(0);

  // Show/hide frames
  const [showAgentChart, setShowAgentChart] = useState(false);
  const [showPlayground, setShowPlayground] = useState(true);

  // Dialog state for viewing a GIF
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogGifUrl, setDialogGifUrl] = useState('');
  const [dialogCopyClicked, setDialogCopyClicked] = useState(false);

  // Menu state for row actions
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Polling ref for checkGifResult
  const pollingRef = useRef(null);

  useEffect(() => {
    if (userId) {
      loadSavedAgent(userId)
        .then(data => setAgents(data))
        .catch(err => console.error(err));
    }
  }, []);

  const loadChartDataForAgent = () => {
    setChartData({
      summaries: [],
      socialMedia: [],
      shops: [],
      products: [],
      sells: [],
    });
  };

  const handleAgentActionsChange = async (event) => {
    const agentId = event.target.value;
    setSelectedAgentActions(agentId);
    loadChartDataForAgent(agentId);
    setToggles({
      summaries: false,
      socialMedia: false,
      shops: false,
      products: false,
      sells: false,
    });
  };

  const handleToggleChange = async (toggleName, isChecked) => {
    setToggles(prev => ({ ...prev, [toggleName]: isChecked }));
    const user_id = userId;
    if (!selectedAgentActions) return;
    if (isChecked && user_id) {
      try {
        const response = await getAgentChartData(toggleName, user_id, selectedAgentActions);
        const resultArray = response && Array.isArray(response.result) ? response.result : [];
        const dateMap = {};
        resultArray.forEach(item => {
          const dayStr = item.createdDate;
          dateMap[dayStr] = (dateMap[dayStr] || 0) + item.count;
        });
        const combined = Object.entries(dateMap).map(([dateStr, totalCount]) => ({ dateStr, totalCount }));
        combined.sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));
        const finalData = combined.map(rec => ({ x: rec.dateStr, y: rec.totalCount }));
        setChartData(prev => ({ ...prev, [toggleName]: finalData }));
      } catch (err) {
        console.error(err);
      }
    } else {
      setChartData(prev => ({ ...prev, [toggleName]: [] }));
    }
  };

  const colorsMap = {
    summaries: 'rgb(255, 99, 132)',
    socialMedia: 'rgb(54, 162, 235)',
    shops: 'rgb(255, 206, 86)',
    products: 'rgb(75, 192, 192)',
    sells: 'rgb(153, 102, 255)',
  };

  const activeDatasets = Object.keys(toggles)
    .filter(key => toggles[key])
    .map(key => ({
      label: key,
      data: chartData[key],
      borderColor: colorsMap[key],
      backgroundColor: colorsMap[key],
      pointRadius: 5,
      pointHoverRadius: 7,
      showLine: true,
    }));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day', round: 'day', tooltipFormat: 'yyyy-MM-dd', displayFormats: { day: 'yyyy-MM-dd' } },
        title: { display: true, text: 'Date', color: '#ccc' },
        ticks: { color: '#ccc' },
        grid: { color: '#444' },
      },
      y: {
        title: { display: true, text: 'Count', color: '#ccc' },
        ticks: { color: '#ccc' },
        grid: { color: '#444' },
      },
    },
    plugins: {
      legend: { labels: { color: '#ccc' } },
      title: { display: true, text: 'Daily Counts (Summed by Date)', color: '#ccc' },
    },
  };

  const handleVideoLinkChange = async (e) => {
    const url = e.target.value;
    setVideoLink(url);
    setVideoDetails(null);
    if (!url.trim()) {
      setVideoLinkError(false);
      setVideoLinkHelperText('');
      return;
    }
    if (!isValidYouTubeUrl(url)) {
      setVideoLinkError(true);
      setVideoLinkHelperText('Invalid YouTube link');
      return;
    }
    setVideoLinkError(false);
    setVideoLinkHelperText('');
    try {
      const details = await getYoutubeVideoDetails(url.trim());
      if (details) {
        const [rawTitle, rawDuration] = details.result.result;
        const title = truncateTitle(rawTitle);
        const { display, totalSec } = parseYouTubeDuration(rawDuration);
        setVideoDetails({ title, displayDuration: display, totalSec });
      } else {
        setVideoLinkError(true);
        setVideoLinkHelperText('Unable to fetch video details');
      }
    } catch (err) {
      console.error(err);
      setVideoLinkError(true);
      setVideoLinkHelperText('Error loading video details');
    }
  };

  const handleGifTimeChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    const result = val.length <= 2 ? val : `${val.slice(0, 2)}:${val.slice(2)}`;
    setGifTime(result);
    setGifTimeError(false);
    setGifTimeHelperText('');
  };

  const handleGifTimeBlur = () => {
    if (!gifTime) {
      setGifTimeError(true);
      setGifTimeHelperText('Time cannot be empty');
      return;
    }
    if (gifTime.length !== 5 || gifTime[2] !== ':') {
      setGifTimeError(true);
      setGifTimeHelperText('Use MM:SS format (e.g. 02:05)');
      return;
    }
    const [mm, ss] = gifTime.split(':');
    const minutes = parseInt(mm, 10);
    const seconds = parseInt(ss, 10);
    if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
      setGifTimeError(true);
      setGifTimeHelperText('Minutes/Seconds must be 00..59');
      return;
    }
    const userInputSec = minutes * 60 + seconds;
    if (videoDetails && videoDetails.totalSec !== null && userInputSec > videoDetails.totalSec) {
      setGifTimeError(true);
      setGifTimeHelperText(`Time cannot exceed video length of ${videoDetails.displayDuration}`);
      return;
    }
    setGifTimeError(false);
    setGifTimeHelperText('');
  };

  const handlePlaygroundMenuClick = (menuItem) => {
    setActivePlaygroundMenu(menuItem);
    setGifTime('');
    setGifTimeError(false);
    setGifTimeHelperText('');
  };

  const finalCheckGifTime = () => {
    handleGifTimeBlur();
    return !gifTimeError && gifTime.length === 5 && !gifTimeHelperText;
  };

  const startPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    const startTime = Date.now();
    pollingRef.current = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= 300000) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        return;
      }
      try {
        const result = await checkGifResult(userId);
        if (result && result.result && result.result) {
          setProcessedGifs(result.result);
        }
      } catch (err) {
        console.error(err);
      }
    }, 90000);
  };

  const handleMakeGif = async () => {
    // Since only link mode is supported, validate YouTube link
    if (!videoLink.trim() || videoLinkError || !userId) {
      alert('Please provide a valid YouTube link first!');
      return;
    }
    if (!finalCheckGifTime()) return;
    const timeForServer = gifTime.replace(':', '');
    setIsSubmitting(true);
    try {
      makeFreeYoutubeVideoGif(videoLink, timeForServer, userId);
      // Immediately clear input fields then wait for 5 seconds before switching to Results tab and starting polling
      setVideoLink('');
      setVideoDetails(null);
      setGifTime('');
      await new Promise(resolve => setTimeout(resolve, 4000));
      await checkGifResult(userId);
      await new Promise(resolve => setTimeout(resolve, 4000));
      setActiveTab(1);
      startPolling();
    } catch (err) {
      console.error(err);
      alert('Error processing GIF. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleMakeAnime = () => {
    if (!videoLink.trim() || videoLinkError) {
      alert('Please provide a valid YouTube link first!');
      return;
    }
    alert(`Processing anime from link: ${videoLink}...`);
  };

  const handleCancel = () => {
    setGifTime('');
    setGifTimeError(false);
    setGifTimeHelperText('');
    setActivePlaygroundMenu('');
  };

  // Row actions menu handlers
  const handleMenuOpen = (event, row) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedRow(null);
  };
  const handleViewRow = () => {
    if (selectedRow && selectedRow.link) {
      setDialogGifUrl(selectedRow.link);
      setDialogOpen(true);
    }
    handleMenuClose();
  };
  const handleCopyRow = () => {
    if (selectedRow && selectedRow.link) {
      navigator.clipboard.writeText(selectedRow.link);
      alert('GIF URL copied to clipboard!');
    }
    handleMenuClose();
  };

  // Functions used in Input display
  const handleCopyUrl = () => {
    if (gifUrl) {
      navigator.clipboard.writeText(gifUrl);
      alert('GIF URL copied to clipboard!');
    }
  };

  const handleDownloadGif = () => {
    if (gifUrl) {
      const link = document.createElement('a');
      link.href = gifUrl;
      link.download = 'video.gif';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Dialog actions
  const handleDialogCopy = () => {
    if (dialogGifUrl) {
      navigator.clipboard.writeText(dialogGifUrl);
      setDialogCopyClicked(true);
      setTimeout(() => setDialogCopyClicked(false), 2000);
    }
  };

  const handleDialogDownload = () => {
    if (dialogGifUrl) {
      const link = document.createElement('a');
      link.href = dialogGifUrl;
      link.download = 'video.gif';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleStartAgain = () => {
    setVideoLink('');
    setVideoDetails(null);
    setGifTime('');
    setGifUrl('');
    setActivePlaygroundMenu('');
    setIsSubmitting(false);
    setActiveTab(0);
    setProcessedGifs([]);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleReloadResults = async () => {
    try {
      const result = await checkGifResult(userId);
      if (result && result.result && result.result) {
        setProcessedGifs(result.result);
      }
    } catch (err) {
      console.error(err);
      alert('Error reloading results.');
    }
  };

  const handleAgentChartClick = async () => {
    setShowAgentChart(prev => !prev);
    if (!showAgentChart && agents.length > 0) {
      const firstAgentId = agents[0].id;
      setSelectedAgentActions(firstAgentId);
      setToggles({
        summaries: false,
        socialMedia: false,
        shops: false,
        products: false,
        sells: false,
      });
      loadChartDataForAgent(firstAgentId);
    }
  };

  const handlePlaygroundClick = () => {
    setShowPlayground(prev => !prev);
  };

  const neitherFrameShown = !showAgentChart && !showPlayground;
  const hasAgents = agents.length > 0;
  const playgroundIconColor = showPlayground ? '#FF9800' : '#ccc';
  const agentChartIconColor = showAgentChart ? '#FF9800' : '#ccc';

  const isVideoSourceValid = videoLink.trim() !== '' && !videoLinkError;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={containerSx}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#ccc', mr: 2 }}>
              Dashboard:
            </Typography>
            Play Ground:
            <IconButton onClick={handlePlaygroundClick} sx={{ color: playgroundIconColor, mr: 1 }}>
              <VideogameAssetIcon />
            </IconButton>
            Agent Activities:
            <IconButton onClick={handleAgentChartClick} sx={{ color: agentChartIconColor }}>
              <BarChartIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={framesContainerSx}>
        {neitherFrameShown && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="path-to-logo.png" alt="Logo" style={{ maxWidth: 200, height: 'auto' }} />
          </Box>
        )}

        {showAgentChart && (
          <Box sx={frameSx}>
            <Card sx={cardSx}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    {hasAgents ? (
                      <>
                        <FormControl size="small" variant="outlined" sx={{ minWidth: 160 }}>
                          <InputLabel sx={{ color: '#ccc' }}>Select Agent</InputLabel>
                          <Select
                            value={selectedAgentActions}
                            onChange={handleAgentActionsChange}
                            label="Select Agent"
                            sx={selectSx}
                          >
                            {agents.map(agent => (
                              <MenuItem key={agent.id} value={agent.id}>
                                {agent.model_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <IconButton sx={{ ml: 2, color: '#ccc' }} onClick={() => navigate('/socialAccounts')}>
                          <AddCircleIcon />
                          <Typography variant="body2" sx={{ ml: 1 }}>Add New Agent</Typography>
                        </IconButton>
                      </>
                    ) : (
                      <IconButton sx={{ ml: 2, color: '#ccc' }} onClick={() => navigate('/socialAccounts')}>
                        <AddCircleIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>Create an agent</Typography>
                      </IconButton>
                    )}
                  </Box>
                }
                sx={{ borderBottom: '1px solid #444' }}
              />
              <CardContent>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={7}>
                    <FormGroup row>
                      {Object.keys(toggles).map(toggleKey => (
                        <FormControlLabel
                          key={toggleKey}
                          control={<Switch checked={toggles[toggleKey]} onChange={e => handleToggleChange(toggleKey, e.target.checked)} />}
                          label={toggleKey}
                          sx={toggleLabelSx}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box sx={{ border: '1px solid #444', p: 1, borderRadius: 1, backgroundColor: '#1f2732' }}>
                      <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', mb: 1, color: '#FF9800' }}>
                        Agent activity details:
                      </Typography>
                      {Object.keys(toggles).some(key => toggles[key])
                        ? Object.keys(toggles)
                            .filter(key => toggles[key])
                            .map(toggleKey => {
                              const dataArray = chartData[toggleKey];
                              const finalValue = dataArray && dataArray.length > 0 ? dataArray[dataArray.length - 1].y : 0;
                              return (
                                <Typography key={toggleKey} variant="body2" sx={{ mb: 0.5 }}>
                                  {toggleKey}: {finalValue}
                                </Typography>
                              );
                            })
                        : <Typography variant="body2">No toggles selected.</Typography>}
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ width: '100%', height: '40vh' }}>
                  {selectedAgentActions ? (
                    activeDatasets.length === 0 ? (
                      <Typography variant="body2">No data selected. Toggle any of the categories above.</Typography>
                    ) : (
                      <Line data={{ datasets: activeDatasets }} options={chartOptions} />
                    )
                  ) : (
                    <Typography variant="body2">Please select an agent to load chart data.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {showPlayground && (
          <Box sx={frameSx}>
            <Card sx={cardSx}>
              <CardHeader
                title={<Typography variant="h6" sx={{ color: '#ccc' }}>Play Ground:</Typography>}
                sx={{ borderBottom: '1px solid #444' }}
              />
              <CardContent>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  textColor="inherit"
                  indicatorColor="primary"
                  sx={{ borderBottom: '1px solid #444', mb: 2 }}
                >
                  <Tab label="Play" />
                  <Tab label="Find out" onClick={() => handleReloadResults()} iconPosition="end" />
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                  {isSubmitting && (
                    <Box sx={{ mb: 2, p: 1, backgroundColor: '#1f2732', border: '1px solid #444', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: '#FF9800' }}>
                        Processing your request. Please wait and do not reload the page.
                      </Typography>
                      <LinearProgress sx={{ mt: 1 }} />
                    </Box>
                  )}
                  <Box sx={{ mb: 2, p: 1, backgroundColor: '#1f2732', border: '1px solid #444', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#FF9800' }}>
                      Info: GIF results expire 24 hours after creation.
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      label="Enter YouTube video link"
                      variant="outlined"
                      fullWidth
                      value={videoLink}
                      onChange={handleVideoLinkChange}
                      error={videoLinkError}
                      helperText={videoLinkHelperText}
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                        '& .MuiFormLabel-root': { color: '#ccc' },
                        '& .MuiInputBase-input': { color: '#fff' },
                      }}
                    />
                    {videoDetails && (
                      <Box sx={{ mt: 1, p: 1, border: '1px solid #444', borderRadius: 1, backgroundColor: '#1f2732' }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Video Title: {videoDetails.title}</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Duration: {videoDetails.displayDuration}</Typography>
                      </Box>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Card sx={{ backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' }}>
                        <List disablePadding>
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => handlePlaygroundMenuClick('gif')}
                              selected={activePlaygroundMenu === 'gif'}
                              disabled={!isVideoSourceValid || isSubmitting}
                            >
                              <GifIcon sx={{ mr: 1 }} />
                              <ListItemText primary="Make GIF from video" />
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => handlePlaygroundMenuClick('anime')}
                              selected={activePlaygroundMenu === 'anime'}
                              disabled={!isVideoSourceValid || isSubmitting}
                            >
                              <AnimationIcon sx={{ mr: 1 }} />
                              <ListItemText primary="Make Anime" />
                            </ListItemButton>
                          </ListItem>
                        </List>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      {activePlaygroundMenu === 'gif' && (
                        <Box sx={{ mb: 2 }}>
                          <TextField
                            label="Time in video (MM:SS)"
                            variant="outlined"
                            value={gifTime}
                            onChange={handleGifTimeChange}
                            onBlur={handleGifTimeBlur}
                            error={gifTimeError}
                            helperText={gifTimeHelperText}
                            disabled={isSubmitting}
                            sx={{
                              mr: 2,
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                              '& .MuiFormLabel-root': { color: '#ccc' },
                              '& .MuiInputBase-input': { color: '#fff' },
                            }}
                          />
                          <IconButton onClick={handleMakeGif} disabled={isSubmitting} sx={{ color: '#ccc' }}>
                            <CheckIcon />
                          </IconButton>
                          <IconButton onClick={handleCancel} disabled={isSubmitting} sx={{ color: '#ccc' }}>
                            <ClearIcon />
                          </IconButton>
                          {isSubmitting && <CircularProgress size={24} sx={{ ml: 1 }} />}
                        </Box>
                      )}
                      {activePlaygroundMenu === 'anime' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Click "Make" to process anime from the above link.
                          </Typography>
                          <IconButton onClick={handleMakeAnime} disabled={isSubmitting} sx={{ color: '#ccc', mr: 1 }}>
                            <CheckIcon />
                          </IconButton>
                          <IconButton onClick={handleCancel} disabled={isSubmitting} sx={{ color: '#ccc' }}>
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      )}
                      {gifUrl && (
                        <Box sx={{ mt: 3, p: 2, border: '1px solid #444', borderRadius: 1, backgroundColor: '#1f2732' }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>Your GIF:</Typography>
                          <Box sx={{ textAlign: 'center' }}>
                            <ReactGifPlayer gif={gifUrl} autoplay={true} style={{ maxWidth: '100%', maxHeight: 300 }} />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="caption" sx={{ mr: 1 }}>
                              {gifUrl.length > 50 ? `${gifUrl.substring(0, 50)}...` : gifUrl}
                            </Typography>
                            <IconButton onClick={handleCopyUrl} size="small" sx={{ color: '#ccc' }}>
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleDownloadGif} size="small" sx={{ color: '#ccc', ml: 1 }}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Button variant="outlined" onClick={handleStartAgain} sx={{ mt: 2, color: '#ccc', borderColor: '#444' }}>
                            Start Again
                          </Button>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: '#ccc' }}>GIF:</Typography>
                    <IconButton onClick={handleReloadResults} sx={{ color: '#ccc' }}>
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ mb: 2, p: 1, backgroundColor: '#1f2732', border: '1px solid #444', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#FF9800' }}>
                      Info: GIF creation: takes ~2 minutes to be visible on table and ~1 minute to complete. You can reload table periodically.
                    </Typography>
                  </Box>
                  <Paper sx={{ width: '100%', mb: 2, backgroundColor: '#161d27', border: '1px solid #444' }}>
                    <TableContainer>
                      <Table size="small" sx={{ minWidth: 300 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: '#ccc', borderBottom: '1px solid #444', backgroundColor: '#1f2732' }}>
                              Time in video
                            </TableCell>
                            <TableCell sx={{ color: '#ccc', borderBottom: '1px solid #444', backgroundColor: '#1f2732' }}>
                              Status
                            </TableCell>
                            <TableCell sx={{ color: '#ccc', borderBottom: '1px solid #444', backgroundColor: '#1f2732' }}>
                              Actions
                            </TableCell>
                            <TableCell sx={{ color: '#ccc', borderBottom: '1px solid #444', backgroundColor: '#1f2732' }}>
                              Video Title
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {processedGifs.length > 0 ? (
                            processedGifs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row) => {
                                const statusText =
                                  row.link === ""
                                    ? "processing..."
                                    : row.link === "Failed"
                                      ? "failed"
                                      : "ready";
                                return (
                                  <TableRow key={row.id} hover>
                                    <TableCell sx={{ borderBottom: '1px solid #444' }}>
                                      <Chip
                                        label={formatProcessedTime(row.time)}
                                        variant="outlined"
                                        size="small"
                                        sx={{ backgroundColor: '#444', color: '#FF9800' }}
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        borderBottom: '1px solid #444',
                                        color:
                                          statusText === "failed"
                                            ? "red"
                                            : statusText === "processing..."
                                              ? "#FF9800"
                                              : "green",
                                      }}
                                    >
                                      {statusText}
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid #444' }}>
                                      <IconButton
                                        onClick={(e) => { setMenuAnchorEl(e.currentTarget); setSelectedRow(row); }}
                                        size="small"
                                        sx={{ color: '#ccc' }}
                                        disabled={row.link === "" || row.link === "Failed"}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ color: '#ccc', borderBottom: '1px solid #444' }} title={row.title}>
                                      {limitWords(row.title, 4) || 'N/A'}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center" sx={{ color: '#ccc' }}>
                                No processed GIFs.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={processedGifs.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{ color: '#ccc' }}
                    />
                  </Paper>
                  <Button variant="outlined" onClick={handleStartAgain} sx={{ mt: 2, color: '#ccc', borderColor: '#444' }}>
                    Make new Gif
                  </Button>
                </TabPanel>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#161d27', color: '#ccc', border: '1px solid #444' } }}
      >
        <DialogTitle>GIF:</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <ReactGifPlayer gif={dialogGifUrl} autoplay={true} style={{ maxWidth: '100%', maxHeight: 400 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleDialogDownload} sx={{ color: '#ccc' }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleDialogCopy} sx={{ color: dialogCopyClicked ? '#FF9800' : '#ccc' }}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#ccc', borderColor: '#444' }} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => { setMenuAnchorEl(null); setSelectedRow(null); }}
      >
        <MenuItem onClick={() => { 
          if (selectedRow && selectedRow.link) {
            setDialogGifUrl(selectedRow.link);
            setDialogOpen(true);
          }
          setMenuAnchorEl(null);
          setSelectedRow(null);
        }}>
          <IconButton size="small" sx={{ color: '#ccc' }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1 }}>View GIF</Typography>
        </MenuItem>
        <MenuItem onClick={() => { 
          if (selectedRow && selectedRow.link) {
            navigator.clipboard.writeText(selectedRow.link);
            alert('GIF URL copied to clipboard!');
          }
          setMenuAnchorEl(null);
          setSelectedRow(null);
        }}>
          <IconButton size="small" sx={{ color: '#ccc' }}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1 }}>Copy GIF link</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HomePage;
