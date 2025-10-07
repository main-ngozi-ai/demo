import React, { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Tooltip,
  CircularProgress,
  Link,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  ButtonGroup,
  Pagination,
  Tabs,
  Tab,
  Collapse,
  TablePagination,
  Checkbox,
  RadioGroup,
  Radio,
  FormControlLabel,
  Menu,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider
} from '@mui/material';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ReplayIcon from '@mui/icons-material/Replay';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

import {
  getAgents,
  deleteSelectedConfig,
  getAgentPosts,
  approveOrRejectPost,
  getAgentShopProducts,
  getAgentKnowledgeSource,
  updateAgentConfigActive,
  getSelectedAgent,
} from '../../../../core/api/auth';

async function deleteUserProduct(productId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 400);
  });
}

async function fetchAgentSummary(agentId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        summaryText: `Placeholder summary for agent ID ${agentId}. Replace with real data.`
      });
    }, 500);
  });
}

async function summarizeKnowledgeRow(rowId, agentId, summaryType) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        summary: `Summary type = ${summaryType}, done for row #${rowId}`,
      });
    }, 1200);
  });
}

async function retryKnowledgeItem(rowId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 700);
  });
}

async function deleteKnowledgeItems(ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 600);
  });
}

function formatCurrency(value) {
  if (!value) return '';
  const numeric = parseFloat(value.toString().replace(/[^\d.]/g, ''));
  if (isNaN(numeric)) return value;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function limitWords(str, maxWords) {
  if (!str) return '';
  const words = str.trim().split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + '...';
}

function getPlatformIcon(platformString = '') {
  const p = platformString.toLowerCase();
  if (p.includes('twitter')) return <TwitterIcon sx={{ mr: 1, color: '#ccc' }} />;
  if (p.includes('facebook')) return <FacebookIcon sx={{ mr: 1, color: '#ccc' }} />;
  if (p.includes('instagram')) return <InstagramIcon sx={{ mr: 1, color: '#ccc' }} />;
  if (p.includes('tiktok')) return <AudiotrackIcon sx={{ mr: 1, color: '#ccc' }} />;
  return <MusicNoteIcon sx={{ mr: 1, color: '#ccc' }} />;
}

const mainContainerSx = {
  p: 2,
  backgroundColor: '#161d27',
  color: '#ccc',
  minHeight: '100vh',
};

const cardSx = {
  backgroundColor: '#161d27',
  border: '1px solid #444',
  color: '#ccc',
  mb: 2,
};

const buttonSx = {
  height: 50,
  fontSize: '1rem',
  textTransform: 'none',
  borderColor: '#444',
  color: '#ccc',
};

const commonButtonSx = {
  textTransform: 'none',
  borderColor: '#444',
  color: '#ccc',
};

const spinAnimation = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  animation: 'spin 1s linear infinite',
  color: 'orange',
  mr: 0.5
};

const truncatedText = (t, m = 20) =>
  t.length <= m
    ? <span>{t}</span>
    : <span title={t}>{t.slice(0, m) + '...'}</span>;

function getChannelDisplay(row) {
  if (row.youtube_channel_title) return row.youtube_channel_title;
  if (row.youtube_channel_id) return row.youtube_channel_id;
  return '(No channel)';
}

const RowActionsMenu = ({ rowTitle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <TableCell align="center">
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: '#ccc' }}>
        <ExpandMoreIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            backgroundColor: '#161d27',
            color: '#ccc',
            border: '1px solid #444',
          }
        }}
      >
        <MenuItem onClick={() => { console.log('ChatGPT for', rowTitle); setAnchorEl(null); }}>
          <ListItemIcon><ChatIcon fontSize="small" sx={{ color: '#ccc' }} /></ListItemIcon>
          <ListItemText primary="ChatGPT" />
        </MenuItem>
        <MenuItem onClick={() => { console.log('Edit', rowTitle); setAnchorEl(null); }}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: '#ccc' }} /></ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem onClick={() => { console.log('View', rowTitle); setAnchorEl(null); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#ccc' }} /></ListItemIcon>
          <ListItemText primary="View" />
        </MenuItem>
        <MenuItem onClick={() => { console.log('Delete', rowTitle); setAnchorEl(null); }}>
          <ListItemIcon><DeleteForeverIcon color="error" fontSize="small" /></ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </TableCell>
  );
};

async function doSummarizeKnowledge(
  rowId,
  agentId,
  sType,
  setKnowledgeLoading,
  setKnowledgeData,
  setSuccessMsg,
  setErrorMsg
) {
  try {
    setKnowledgeLoading(true);
    setKnowledgeData((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, transcript_summary: 'summarizing' } : r
      )
    );
    const resp = await summarizeKnowledgeRow(rowId, agentId, sType);
    setKnowledgeData((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, transcript_summary: resp.summary || '(No summary returned?)' }
          : r
      )
    );
    setSuccessMsg('Transcript sent for summarizing!');
  } catch (error) {
    console.error('Error summarizing knowledge item:', error);
    setErrorMsg('Error summarizing knowledge item. See console.');
  } finally {
    setKnowledgeLoading(false);
  }
}

const Agents = ({user}) => {
  const userId = user?.id || localStorage.getItem('userId');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [agentConfigs, setAgentConfigs] = useState([]);
  const [rowUpdating, setRowUpdating] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageAgentConfig, setPageAgentConfig] = useState(0);
  const rowsPerPageAgentConfig = 5;

  const [discussions, setDiscussions] = useState([]);
  const [rowBlink, setRowBlink] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  const [sourceFilter, setSourceFilter] = useState('All');
  const [copiedState, setCopiedState] = useState({});

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editField, setEditField] = useState('postContent');
  const [selectedAgentChatGptId, setSelectedAgentChatGptId] = useState('');

  const [selectedAgentActivity, setSelectedAgentActivity] = useState('');

  const [tabIndex, setTabIndex] = useState(0);

  const [shops, setShops] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [expandedShop, setExpandedShop] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState([]);
  const [pageShop, setPageShop] = useState(0);
  const rowsPerPageShop = 5;
  const [loadingShop, setLoadingShop] = useState(false);
  const [openRemoveProductDialog, setOpenRemoveProductDialog] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);


  const [knowledgeData, setKnowledgeData] = useState([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [selectedRowsK, setSelectedRowsK] = useState([]);
  const [deleteDialogOpenK, setDeleteDialogOpenK] = useState(false);
  const [filterChannel, setFilterChannel] = useState('All');
  const [filterReady, setFilterReady] = useState('All');
  const [filterSummarized, setFilterSummarized] = useState('All');
  const [knowledgeCurrentPage, setKnowledgeCurrentPage] = useState(1);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [agentSummary, setAgentSummary] = useState('');

  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [dialogSummaryRow, setDialogSummaryRow] = useState(null);
  const [summaryType, setSummaryType] = useState('long');
  const [selectedSummarizeAgent, setSelectedSummarizeAgent] = useState('');

  const [chunkViewOpen, setChunkViewOpen] = useState(false);
  const [chunkViewData, setChunkViewData] = useState([]);
  const [chunkViewAgentName, setChunkViewAgentName] = useState('');

  const [activeSocialPlatform, setActiveSocialPlatform] = useState('twitter');

  const getSelectedAgentDetails = async (id) => {
    try {
      const resp = await getSelectedAgent(id);
      return resp ? resp.properties : null;
    } catch (err) {
      console.error('Error fetching Agent details:', err);
      return null;
    }
  };

  async function handleApproveChunk() {
    if (discussions[0]?.id) {
      await approveOrRejectPost(discussions[0].id, 'approve').catch(console.error);
      setSuccessMsg('Chunk summary approved!');
    }
  }
  async function handleRejectChunk() {
    if (discussions[0]?.id) {
      await approveOrRejectPost(discussions[0].id, 'reject').catch(console.error);
      setSuccessMsg('Chunk summary rejected!');
    }
  }

  const [chunkEditDialogOpen, setChunkEditDialogOpen] = useState(false);
  const [chunkEditValue, setChunkEditValue] = useState('');
  const handleEditChunk = () => {
    if (discussions.length > 0) {
      setChunkEditValue(discussions[0].postTitle);
    }
    setChunkEditDialogOpen(true);
  };
  const handleSaveChunk = () => {
    if (discussions.length > 0) {
      const updated = [...discussions];
      updated[0].postTitle = chunkEditValue;
      setDiscussions(updated);
      setSuccessMsg('Chunk summary updated!');
    }
    setChunkEditDialogOpen(false);
  };

  function handleOpenChunkView() {
    if (!discussions.length) return;
    const agentName =
      agentConfigs.find((a) => a.agent_id === selectedAgentActivity)?.model_name ||
      '(Unknown Agent)';
    const topSource = discussions[0].source_title || 'Unknown Source';
    const sameSource = discussions.filter((d) => d.source_title === topSource);
    const uniqueSummaries = [...new Set(sameSource.map((item) => item.postTitle))];
    setChunkViewData(uniqueSummaries);
    setChunkViewAgentName(agentName);
    setChunkViewOpen(true);
  }
  const handleCopyAllChunks = () => {
    const joinedText = chunkViewData.join('\n\n');
    navigator.clipboard.writeText(joinedText).catch(console.error);
    setSuccessMsg('All chunk summaries copied to clipboard!');
  };

  useEffect(() => {
    fetchAgentConfigs();
  }, []);

  async function fetchAgentConfigs() {
    try {
      if (userId) {
        setLoading(true);
        const data = await getAgents(userId);
        setAgentConfigs(data.data || []);
      }
    } catch (err) {
      setErrorMsg('Error fetching data from server');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedAgentActivity) {
      loadAgentPosts(selectedAgentActivity);
      setActiveSocialPlatform('twitter');
    }
  }, [selectedAgentActivity]);

  async function loadAgentPosts(agentId) {
    try {
      const posts = await getAgentPosts(agentId);
      const newDiscussions = posts?.result.map((p) => ({
        id: p.id,
        platform: p.platform,
        source: p.transcript_id || 'Unknown User',
        source_title: p.source_title || '',
        postDateRaw: p.created_at || 'N/A',
        postTitle: p.summary || 'No Title',
        postContent: p.post_content || 'Empty content',
      }));
      setDiscussions(newDiscussions || []);
      setPage(1);
      setSourceFilter('All');
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (tabIndex === 0 && selectedAgentActivity) {
      loadShops(selectedAgentActivity);
    }
  }, [tabIndex, selectedAgentActivity]);

  async function loadShops(agentId) {
    setLoadingShop(true);
    try {
      const shopsResponse = await getAgentShopProducts(agentId);
      setShops(shopsResponse.shops || []);
      setAllProducts(shopsResponse.products || []);
    } catch (error) {
      console.error('Error loading shops/products:', error);
    } finally {
      setLoadingShop(false);
    }
  }

  useEffect(() => {
    if (tabIndex === 1 && selectedAgentActivity) {
      loadKnowledgeData(selectedAgentActivity);
      fetchAgentSummaryData(selectedAgentActivity);
    }
  }, [tabIndex, selectedAgentActivity]);

  async function loadKnowledgeData(agentId) {
    setKnowledgeLoading(true);
    try {
      const resp = await getAgentKnowledgeSource(agentId);
      if (resp) {
        setKnowledgeData(resp.result || []);
      }
    } catch (error) {
      console.error('Error loading knowledge data:', error);
    } finally {
      setKnowledgeLoading(false);
    }
  }
  async function fetchAgentSummaryData(agentId) {
    setLoadingSummary(true);
    try {
      const resp = await fetchAgentSummary(agentId);
      if (resp.success) {
        setAgentSummary(resp.summaryText || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  }

  const filteredAgentConfigs = useMemo(() => {
    if (!selectedAgentActivity) {
      return [];
    }
    return agentConfigs.filter((cfg) => cfg.agent_id === selectedAgentActivity);
  }, [agentConfigs, selectedAgentActivity]);

  const startACIndex = pageAgentConfig * rowsPerPageAgentConfig;
  const endACIndex = startACIndex + rowsPerPageAgentConfig;
  const displayedAgentConfigs = filteredAgentConfigs.slice(startACIndex, endACIndex);

  const handleChangePageAgentConfig = (event, newPage) => {
    setPageAgentConfig(newPage);
  };

  const handleToggleActive = async (row) => {
    const recordId = row.id;
    const newValue = row.is_active ? 0 : 1;
    setRowUpdating((prev) => ({ ...prev, [recordId]: true }));
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const resp = await updateAgentConfigActive(recordId, newValue);
      if (resp.success) {
        setAgentConfigs((prev) =>
          prev.map((cfg) => (cfg.id === recordId ? { ...cfg, is_active: newValue } : cfg))
        );
        setSuccessMsg(`${row.model_name} updated to: ${newValue === 0 ? 'False' : 'True'}`);
      } else {
        setErrorMsg('Error updating record');
      }
    } catch (err) {
      console.error('Error updating is_active:', err);
      setErrorMsg('Error updating record');
    } finally {
      setRowUpdating((prev) => ({ ...prev, [recordId]: false }));
    }
  };

  const handleSelectAllAgents = (event) => {
    if (event.target.checked) {
      const allIds = displayedAgentConfigs.map((r) => r.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectRowAgents = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelectedAgents = () => {
    if (!selectedIds.length) {
      setErrorMsg('No rows selected to delete');
      return;
    }
    setDeleteDialogOpen(true);
  };
  const handleDialogCancel = () => {
    setDeleteDialogOpen(false);
  };
  const handleDialogConfirm = async () => {
    setDeleteDialogOpen(false);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setLoading(true);
      const resp = await deleteSelectedConfig(selectedIds);
      if (resp.success) {
        await fetchAgentConfigs();
        setSelectedIds([]);
        setSuccessMsg('Selected row(s) deleted successfully');
      } else {
        setErrorMsg('Error deleting rows');
      }
    } catch (err) {
      console.error('Error deleting selected rows:', err);
      setErrorMsg('Error deleting rows');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentActivityChange = async (e) => {
    setSelectedAgentActivity(e.target.value);
    const id = e.target.value;
    setSelectedAgentChatGptId('')
    const details = await getSelectedAgentDetails(id);
    setSelectedAgentChatGptId(details?.chat_gpt_id);
  };

  const distinctSources = useMemo(() => {
    const setOfSources = new Set(discussions.map((d) => d.source_title || 'Unknown'));
    return Array.from(setOfSources);
  }, [discussions]);

  const filteredByPlatform = useMemo(() => {
    return discussions.filter(
      (d) => d.platform && d.platform.toLowerCase().includes(activeSocialPlatform.toLowerCase())
    );
  }, [discussions, activeSocialPlatform]);

  const filteredDiscussions = useMemo(() => {
    if (sourceFilter === 'All') {
      return filteredByPlatform;
    }
    return filteredByPlatform.filter((d) => d.source_title === sourceFilter);
  }, [filteredByPlatform, sourceFilter]);

  const totalPages = Math.ceil(filteredDiscussions.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDiscussions = filteredDiscussions.slice(startIndex, endIndex);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleApprove = async (discIndex) => {
    const post = filteredDiscussions[discIndex];
    if (post && post.id) {
        const resp = await approveOrRejectPost(post.id, 1).catch(console.error);
        if(resp.success) {
            blinkRow(discIndex, 'green');
        } else{
            setErrorMsg('Error approving post');
        }
    }
  };
  const handleReject = async (discIndex) => {
    const post = filteredDiscussions[discIndex];
    if (post && post.id) {
        const resp = await approveOrRejectPost(post.id, 0).catch(console.error);
        if(resp.success) {
            blinkRow(discIndex, 'red');
        } else{
            setErrorMsg('Error rejecting post');
        }
    }
  };

  function blinkRow(discIndex, color) {
    const actualDiscussion = filteredDiscussions[discIndex];
    const originalIndex = discussions.findIndex((d) => d.id === actualDiscussion.id);
    if (originalIndex === -1) return;
    setRowBlink((prev) => ({ ...prev, [originalIndex]: color }));
    setTimeout(() => {
      setDiscussions((prev) => prev.filter((_, i) => i !== originalIndex));
      setRowBlink((prevBlink) => {
        const newBlink = { ...prevBlink };
        delete newBlink[originalIndex];
        return newBlink;
      });
    }, 1000);
  }

  const handleEdit = (discussion, discIndex, fieldName = 'postContent') => {
    const actualDiscussion = filteredDiscussions[discIndex];
    const originalIndex = discussions.findIndex((d) => d.id === actualDiscussion.id);
    setEditIndex(originalIndex);
    setEditField(fieldName);
    setEditContent(discussion[fieldName]);
    setOpenEditDialog(true);
  };
  const handleSave = () => {
    const updated = [...discussions];
    if (editField === 'postTitle') {
      updated[editIndex].postTitle = editContent;
    } else {
      updated[editIndex].postContent = editContent;
    }
    setDiscussions(updated);
    setOpenEditDialog(false);
    blinkRowByOriginalIndex(editIndex, 'green');
  };
  function blinkRowByOriginalIndex(idx, color) {
    setRowBlink((prev) => ({ ...prev, [idx]: color }));
    setTimeout(() => {
      setDiscussions((prev) => prev.filter((_, i) => i !== idx));
      setRowBlink((prevBlink) => {
        const newBlink = { ...prevBlink };
        delete newBlink[idx];
        return newBlink;
      });
    }, 1000);
  }

  const handleCopy = async (discussionId, partKey, textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedState((prev) => ({
        ...prev,
        [`${discussionId}-${partKey}`]: true,
      }));
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const displayedShops = shops.slice(pageShop * rowsPerPageShop, pageShop * rowsPerPageShop + rowsPerPageShop);
  const handleChangePageShop = (event, newPage) => {
    setPageShop(newPage);
  };
  const handleExpandShop = (shopId) => {
    if (expandedShop === shopId) {
      setExpandedShop(null);
      setExpandedProducts([]);
      return;
    }
    const filtered = allProducts.filter((p) => p.shop_id === shopId);
    setExpandedShop(shopId);
    setExpandedProducts(filtered);
  };

  const confirmRemoveProduct = (product) => {
    setProductToRemove(product);
    setOpenRemoveProductDialog(true);
  };
  const handleConfirmRemoveProduct = async () => {
    if (!productToRemove) return;
    try {
      await deleteUserProduct(productToRemove.id);
      setExpandedProducts((prev) => prev.filter((p) => p.id !== productToRemove.id));
      setAllProducts((prev) => prev.filter((p) => p.id !== productToRemove.id));
      setSuccessMsg('Product removed successfully.');
    } catch (error) {
      console.error('Error removing product:', error);
      setErrorMsg('Error removing product. See console.');
    }
    setOpenRemoveProductDialog(false);
    setProductToRemove(null);
  };
  const handleCancelRemoveProduct = () => {
    setOpenRemoveProductDialog(false);
    setProductToRemove(null);
  };

  const PAGE_SIZE = 10;
  const handleDeleteKnowledgeRows = () => {
    if (!selectedRowsK.length) {
      setErrorMsg('No rows selected to delete');
      return;
    }
    setDeleteDialogOpenK(true);
  };
  const handleCancelDeleteK = () => setDeleteDialogOpenK(false);
  const handleConfirmDeleteK = async () => {
    setDeleteDialogOpenK(false);
    try {
      setKnowledgeLoading(true);
      await deleteKnowledgeItems(selectedRowsK);
      setKnowledgeData((prev) => prev.filter((r) => !selectedRowsK.includes(r.id)));
      setSelectedRowsK([]);
      setSuccessMsg('Selected knowledge record(s) deleted successfully');
    } catch (error) {
      console.error('Error deleting knowledge items:', error);
      setErrorMsg('Error deleting knowledge items. See console.');
    } finally {
      setKnowledgeLoading(false);
    }
  };

  const handleSelectAllK = (e) => {
    if (e.target.checked) {
      setSelectedRowsK(knowledgeData.map((r) => r.id));
    } else {
      setSelectedRowsK([]);
    }
  };
  const handleSelectRowK = (rowId) => {
    setSelectedRowsK((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  function isReadyState(row) {
    return row.state === 'Transcribed' || row.state === 'Scraped';
  }
  function hasSummary(row) {
    return !!(
      row.transcript_summary &&
      row.transcript_summary !== '' &&
      row.transcript_summary !== 'summarizing'
    );
  }

  const filteredKnowledge = useMemo(() => {
    return knowledgeData.filter((row) => {
      if (filterChannel !== 'All' && row.youtube_channel_title !== filterChannel) return false;
      if (filterReady !== 'All') {
        const ready = isReadyState(row);
        if (filterReady === 'Yes' && !ready) return false;
        if (filterReady === 'No' && ready) return false;
      }
      if (filterSummarized !== 'All') {
        const summarized = hasSummary(row);
        if (filterSummarized === 'Yes' && !summarized) return false;
        if (filterSummarized === 'No' && summarized) return false;
      }
      return true;
    });
  }, [knowledgeData, filterChannel, filterReady, filterSummarized]);

  const sortedKnowledge = useMemo(() => {
    return [...filteredKnowledge].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [filteredKnowledge]);

  const totalKPages = Math.ceil(sortedKnowledge.length / PAGE_SIZE);
  const knowledgeStartIndex = (knowledgeCurrentPage - 1) * PAGE_SIZE;
  const currentKnowledge = sortedKnowledge.slice(
    knowledgeStartIndex,
    knowledgeStartIndex + PAGE_SIZE
  );

  const handleRetryKnowledge = async (rowId) => {
    try {
      setKnowledgeLoading(true);
      await retryKnowledgeItem(rowId);
      if (selectedAgentActivity) {
        await loadKnowledgeData(selectedAgentActivity);
      }
      setSuccessMsg('Media sent for Transcribing!');
    } catch (error) {
      console.error(error);
      setErrorMsg('Error retrying item');
    } finally {
      setKnowledgeLoading(false);
    }
  };

  function renderStatusCell(row) {
    const st = row.state || '';
    if (st === 'Transcribed' || st === 'Scraped') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: 'green', mr: 0.5 }}>{st}</Typography>
        </Box>
      );
    } else if (st === 'Failed') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => handleRetryKnowledge(row.id)}
        >
          <ReplayIcon sx={{ color: 'red', mr: 0.5 }} />
          <Typography sx={{ color: 'red' }}>{st}</Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutorenewIcon sx={spinAnimation} />
          <Typography sx={{ color: 'orange' }}>{st}</Typography>
        </Box>
      );
    }
  }

  function renderSummarizedCell(row) {
    if (!row.transcript) {
      return <Typography>Not Ready</Typography>;
    }
    if (row.transcript_summary === 'summarizing') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutorenewIcon sx={spinAnimation} />
          <Typography sx={{ color: 'orange', mr: 1 }}>Summarizing</Typography>
        </Box>
      );
    }
    if (!row.transcript_summary) {
      return (
        <Button
          variant="text"
          size="small"
          sx={{ textTransform: 'none', color: '#66ccff' }}
          onClick={() => {
            setDialogSummaryRow(row);
            setIsSummaryDialogOpen(true);
            setSummaryType('long');
            setSelectedSummarizeAgent('');
          }}
        >
          No! Start {'>>'}
        </Button>
      );
    }
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'green' }}>
        <Typography sx={{ mr: 0.5 }}>Yes</Typography>
      </Box>
    );
  }

  return (
    <Box sx={mainContainerSx}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#ccc' }}>
              View Agents:
            </Typography>
          </Grid>
        </Grid>
      <Card sx={cardSx}>
        <CardContent>
          <Card
            sx={{
              backgroundColor: '#161d27',
              border: '1px solid #444',
              color: '#ccc',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mr: 2, color: '#ccc' }}>
                  My Agents:
                </Typography>
                <FormControl size="small" variant="outlined" sx={{ minWidth: 160 }}>
                  <InputLabel sx={{ color: '#ccc' }}>Select Agent</InputLabel>
                  <Select
                    label="Select Agent"
                    value={selectedAgentActivity}
                    onChange={handleAgentActivityChange}
                    sx={{
                      color: '#ccc',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                    }}
                  >
                    {agentConfigs.map((agent, idx) => (
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
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            <Grid item xs={15} md={15}>
              <Box
                sx={{
                  backgroundColor: '#161d27',
                  border: '1px solid #444',
                  color: '#ccc',
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ borderBottom: 'none', pb: 0, color: '#ccc', mb: 2 }}>
                    Generated Knowledge Sources:
                  </Typography>
                  <FormControl
                    size="small"
                    variant="outlined"
                    sx={{
                      minWidth: 160,
                      mb: 2,
                    }}
                  >
                    <InputLabel sx={{ color: '#ccc' }}>Source Filter</InputLabel>
                    <Select
                      label="Source Filter"
                      value={sourceFilter}
                      onChange={(e) => {
                        setSourceFilter(e.target.value);
                        setPage(1);
                      }}
                      sx={{
                        color: '#ccc',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                      }}
                    >
                      <MenuItem value="All">All</MenuItem>
                      {distinctSources.map((src) => (
                        <MenuItem key={src} value={src}>
                          {src}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {discussions.length > 0 && (
                  <Card
                    sx={{
                      mb: 1,
                      border: '1px solid #444',
                      backgroundColor: '#161d27',
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ color: '#ccc' }}>
                            <strong>Source:</strong>{' '}
                            <Link
                              href={`/transcribed/${discussions[0].source}`}
                              underline="hover"
                              sx={{ color: '#66ccff', textDecoration: 'none', mr: 2 }}
                            >
                              <VisibilityIcon />
                            </Link>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>
                            Summarized on: {dayjs(discussions[0].postDateRaw).format('MMM D, YYYY h:mm A')}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ position: 'relative', paddingRight: '40px', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                          <strong style={{ color: '#FF9800', mb: 1 }}>Summary:</strong>{' '}
                          {truncatedText(discussions[0].postTitle, 150)}
                          {' '}
                          <Tooltip title="View entire chunk summary">
                            <IconButton
                              onClick={handleOpenChunkView}
                              sx={{
                                color: '#66ccff'
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Tooltip title="Show Twitter posts">
                            <IconButton
                              sx={{ border: '1px solid #444', color: '#ccc' }}
                              onClick={() => {
                                setActiveSocialPlatform('twitter');
                                setPage(1);
                              }}
                            >
                              <TwitterIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Show Facebook posts">
                            <IconButton
                              sx={{ border: '1px solid #444', color: '#ccc' }}
                              onClick={() => {
                                setActiveSocialPlatform('facebook');
                                setPage(1);
                              }}
                            >
                              <FacebookIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Show Instagram posts">
                            <IconButton
                              sx={{ border: '1px solid #444', color: '#ccc' }}
                              onClick={() => {
                                setActiveSocialPlatform('instagram');
                                setPage(1);
                              }}
                            >
                              <InstagramIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Show TikTok posts">
                            <IconButton
                              sx={{ border: '1px solid #444', color: '#ccc' }}
                              onClick={() => {
                                setActiveSocialPlatform('tiktok');
                                setPage(1);
                              }}
                            >
                              <AudiotrackIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {displayedDiscussions.map((discussion, idx) => {
                  const discIndex = idx; 
                  const formattedMainDate =
                    discussion.postDateRaw !== 'N/A'
                      ? dayjs(discussion.postDateRaw).format('MMM D, YYYY h:mm A')
                      : 'N/A';

                  const originalIndex = discussions.findIndex((d) => d.id === discussion.id);
                  return (
                    <Card
                      key={`${discussion.id}-${idx}`}
                      sx={{
                        mb: 2,
                        border: '1px solid #444',
                        backgroundColor: rowBlink[originalIndex] || '#1f2630',
                        transform: rowBlink[originalIndex] ? 'translateX(100%)' : 'translateX(0)',
                        transition: 'transform 1s, background-color 0.5s',
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getPlatformIcon(discussion.platform)}
                          </Box>
                          <Box>
                            <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>
                              Created on: {formattedMainDate}
                            </Typography>
                            <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>
                              Posting on: {formattedMainDate}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ position: 'relative', paddingRight: '40px' }}>
                          <IconButton
                            onClick={() =>
                              handleCopy(discussion.id, 'content', discussion.postContent)
                            }
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              color: copiedState[`${discussion.id}-content`] ? 'green' : '#ccc'
                            }}
                          >
                            <FileCopyIcon />
                          </IconButton>

                          <Typography variant="body2" sx={{ mb: 1, color: '#ccc' }}>
                            <strong style={{ color: '#FF9800', mb: 1 }}>Generated Post:</strong>{' '}
                            {limitWords(discussion.postContent, 100)}
                          </Typography>
                          <ButtonGroup size="small" variant="outlined">
                            <Button
                              startIcon={<CheckCircleIcon />}
                              sx={commonButtonSx}
                              onClick={() => handleApprove(discIndex)}
                            >
                              Approve
                            </Button>
                            <Button
                              startIcon={<CancelIcon />}
                              sx={commonButtonSx}
                              onClick={() => handleReject(discIndex)}
                            >
                              Reject
                            </Button>
                            <Button
                              startIcon={<MoreVertIcon />}
                              sx={commonButtonSx}
                              onClick={() => handleEdit(discussion, discIndex, 'postContent')}
                            >
                              Edit
                            </Button>
                          </ButtonGroup>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}

                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    sx={{
                      color: '#ccc',
                      '.MuiPaginationItem-root': {
                        color: '#ccc',
                        borderColor: '#444',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={cardSx}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>
            Tasks
          </Typography>
          <Tabs
            value={tabIndex}
            onChange={(_, val) => setTabIndex(val)}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: '#66ccff' } }}
            sx={{
              mb: 2,
              borderBottom: '1px solid #444',
              '.MuiTab-root': {
                textTransform: 'none',
              },
            }}
          >
            <Tab label="Shops" />
            <Tab label="Knowledge Source" />
            <Tab label="Post Configuration" />
          </Tabs>

          {tabIndex === 0 && (
            <Box sx={{ mt: 2 }}>
              {loadingShop ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <CircularProgress sx={{ color: '#ccc' }} />
                </Box>
              ) : shops.length === 0 ? (
                <Typography sx={{ color: '#999' }}>No shops found.</Typography>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{ backgroundColor: '#161d27', border: '1px solid #444' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#ccc' }}>Name</TableCell>
                        <TableCell sx={{ color: '#ccc' }}>Products</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedShops.map((shop, index) => (
                        <React.Fragment key={`${shop.id}-${index}`}>
                          <TableRow>
                            <TableCell sx={{ color: '#ccc', border: '1px solid #444' }}>
                              {shop.name}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid #444' }}>
                              <IconButton onClick={() => handleExpandShop(shop.id)} sx={{ color: '#66ccff' }}>
                                <ExpandMoreIcon
                                  sx={{
                                    transform:
                                      expandedShop === shop.id ? 'rotate(180deg)' : 'rotate(0deg)'
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              sx={{ paddingBottom: 0, paddingTop: 0, border: 'none' }}
                            >
                              <Collapse in={expandedShop === shop.id} timeout="auto" unmountOnExit>
                                <Box margin={1}>
                                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#ccc' }}>
                                    Products in <b>{shop.name}</b>:
                                  </Typography>
                                  <Table size="small" sx={{ backgroundColor: '#161d27' }}>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ color: '#ccc', border: '1px solid #444' }}>
                                          Remove
                                        </TableCell>
                                        <TableCell sx={{ color: '#ccc', border: '1px solid #444' }}>
                                          Name
                                        </TableCell>
                                        <TableCell sx={{ color: '#ccc', border: '1px solid #444' }}>
                                          Description
                                        </TableCell>
                                        <TableCell sx={{ color: '#ccc', border: '1px solid #444' }}>
                                          Price
                                        </TableCell>
                                        <TableCell sx={{ color: '#ccc', border: '1px solid #444' }}>
                                          Link
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {expandedProducts.length > 0 ? (
                                        expandedProducts.map((prod, idx) => (
                                          <TableRow key={`${prod.id}-${idx}`}>
                                            <TableCell sx={{ border: '1px solid #444' }}>
                                              <IconButton onClick={() => confirmRemoveProduct(prod)}>
                                                <DeleteForeverIcon sx={{ color: '#ff4444' }} />
                                              </IconButton>
                                            </TableCell>
                                            <TableCell
                                              sx={{ color: '#ccc', border: '1px solid #444' }}
                                            >
                                              {prod.name}
                                            </TableCell>
                                            <TableCell
                                              sx={{ color: '#ccc', border: '1px solid #444' }}
                                            >
                                              {prod.description}
                                            </TableCell>
                                            <TableCell
                                              sx={{ color: '#ccc', border: '1px solid #444' }}
                                            >
                                              ${formatCurrency(prod.price)}
                                            </TableCell>
                                            <TableCell
                                              sx={{ color: '#ccc', border: '1px solid #444' }}
                                            >
                                              {prod.link}
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell
                                            colSpan={5}
                                            align="center"
                                            sx={{ border: '1px solid #444', color: '#ccc' }}
                                          >
                                            No products found.
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={shops.length}
                    page={pageShop}
                    onPageChange={handleChangePageShop}
                    rowsPerPage={rowsPerPageShop}
                    rowsPerPageOptions={[]}
                    sx={{
                      backgroundColor: '#161d27',
                      color: '#ccc',
                      borderTop: '1px solid #444',
                    }}
                  />
                </TableContainer>
              )}
            </Box>
          )}

          {tabIndex === 1 && (
            <Box sx={{ mt: 2 }}>
              {loadingSummary ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress sx={{ color: '#ccc' }} />
                </Box>
              ) : null}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'space-between',
                  mb: 2
                }}
              >
                <Typography variant="h6" sx={{ color: '#ccc' }}>
                  Knowledge Source:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Tooltip title="Refresh knowledge data">
                    <IconButton
                      onClick={() => {
                        if (selectedAgentActivity) {
                          loadKnowledgeData(selectedAgentActivity);
                        }
                      }}
                      sx={{ border: '1px solid #444', color: '#ccc' }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete selected rows">
                    <IconButton
                      onClick={handleDeleteKnowledgeRows}
                      disabled={!selectedRowsK.length}
                      sx={{ border: '1px solid #444', color: '#ccc' }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Ready</InputLabel>
                    <Select
                      label="Ready"
                      value={filterReady}
                      onChange={(e) => setFilterReady(e.target.value)}
                      sx={{
                        color: '#ccc',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                      }}
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Summarized</InputLabel>
                    <Select
                      label="Summarized"
                      value={filterSummarized}
                      onChange={(e) => setFilterSummarized(e.target.value)}
                      sx={{
                        color: '#ccc',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                      }}
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              {errorMsg && (
                <Alert
                  severity="error"
                  sx={{ mb: 2, backgroundColor: '#261d1d', color: 'red' }}
                  onClose={() => setErrorMsg('')}
                >
                  {errorMsg}
                </Alert>
              )}
              {successMsg && (
                <Alert
                  severity="success"
                  sx={{ mb: 2, backgroundColor: '#1d2620', color: 'green' }}
                  onClose={() => setSuccessMsg('')}
                >
                  {successMsg}
                </Alert>
              )}
              {knowledgeLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <CircularProgress sx={{ color: '#ccc' }} />
                </Box>
              ) : (
                <>
                  <TableContainer
                    component={Paper}
                    sx={{
                      overflowX: 'auto',
                      backgroundColor: '#161d27',
                      border: '1px solid #444',
                      '& td, & th': {
                        py: '2px',
                        lineHeight: '1.1rem',
                        color: '#ccc',
                        backgroundColor: '#161d27'
                      }
                    }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={
                                selectedRowsK.length > 0 && selectedRowsK.length < knowledgeData.length
                              }
                              checked={
                                knowledgeData.length > 0 && selectedRowsK.length === knowledgeData.length
                              }
                              onChange={handleSelectAllK}
                              sx={{ color: '#ccc' }}
                            />
                          </TableCell>
                          <TableCell sx={{ backgroundColor: '#202530', color: '#ccc' }}>
                            Status
                          </TableCell>
                          <TableCell sx={{ backgroundColor: '#202530', color: '#ccc' }}>
                            Summarized?
                          </TableCell>
                          <TableCell sx={{ backgroundColor: '#202530', color: '#ccc' }}>
                            Video/Page Title
                          </TableCell>
                          <TableCell sx={{ backgroundColor: '#202530', color: '#ccc' }}>
                            Channel/Website
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: '#202530',
                              color: '#ccc',
                              display: { xs: 'none', sm: 'table-cell' }
                            }}
                          >
                            Source Type
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: '#202530',
                              color: '#ccc',
                              display: { xs: 'none', sm: 'table-cell' }
                            }}
                          >
                            Date Uploaded
                          </TableCell>
                          <TableCell sx={{ backgroundColor: '#202530', color: '#ccc' }} align="center">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentKnowledge.map((row, index) => (
                          <TableRow key={`${row.id}-${index}`}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                sx={{ color: '#ccc' }}
                                checked={selectedRowsK.includes(row.id)}
                                onChange={() => handleSelectRowK(row.id)}
                                disabled={
                                  !(
                                    row.state === 'Failed' ||
                                    row.state === 'Transcribed' ||
                                    row.state === 'Scraped'
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>{renderStatusCell(row)}</TableCell>
                            <TableCell>{renderSummarizedCell(row)}</TableCell>
                            <TableCell>
                              <a
                                href={`/transcribed/${row.id}`}
                                style={{ color: '#66ccff', textDecoration: 'none' }}
                              >
                                {truncatedText(row.transcript_title || '', 30)}
                              </a>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {row.channel_logo_url ? (
                                  <Avatar
                                    src={row.channel_logo_url}
                                    alt={row.youtube_channel_title}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                  />
                                ) : (
                                  <MusicNoteIcon sx={{ color: 'red', mr: 1 }} />
                                )}
                                {truncatedText(getChannelDisplay(row), 35)}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                              {row.video_id ? 'YouTube' : 'Web'}
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                              {row.createdAt ? dayjs(row.createdAt).format('MMM D, YYYY h:mm A') : ''}
                            </TableCell>
                            <RowActionsMenu rowTitle={row.transcript_title || 'No Title'} />
                          </TableRow>
                        ))}
                        {!currentKnowledge.length && (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              No records found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}
                  >
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      Showing {knowledgeStartIndex + 1}–
                      {knowledgeStartIndex + currentKnowledge.length} of {sortedKnowledge.length}
                    </Typography>
                    <Pagination
                      count={totalKPages}
                      page={knowledgeCurrentPage}
                      onChange={(e, val) => setKnowledgeCurrentPage(val)}
                      sx={{
                        color: '#ccc',
                        '.MuiPaginationItem-root': { color: '#ccc', borderColor: '#444' },
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>
          )}

          {tabIndex === 2 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#ccc' }}>
                  Post Configuration
                </Typography>
                <Box>
                  <Tooltip title="Refresh table">
                    <span>
                      <IconButton
                        color="primary"
                        onClick={fetchAgentConfigs}
                        sx={{ border: '1px solid #444', color: '#ccc', mr: 2 }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete selected rows">
                    <span>
                      <IconButton
                        color="error"
                        onClick={handleDeleteSelectedAgents}
                        disabled={!selectedIds.length}
                        sx={{ border: '1px solid #444', color: '#ccc' }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
              {errorMsg && (
                <Alert
                  severity="error"
                  sx={{ mb: 2, backgroundColor: '#261d1d', color: 'red' }}
                  onClose={() => setErrorMsg('')}
                >
                  {errorMsg}
                </Alert>
              )}
              {successMsg && (
                <Alert
                  severity="success"
                  sx={{ mb: 2, backgroundColor: '#1d2620', color: 'green' }}
                  onClose={() => setSuccessMsg('')}
                >
                  {successMsg}
                </Alert>
              )}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <CircularProgress sx={{ color: '#ccc' }} />
                </Box>
              ) : (
                <>
                  {filteredAgentConfigs.length === 0 ? (
                    <Typography sx={{ color: '#999' }}>No records found.</Typography>
                  ) : (
                    <TableContainer
                      component={Paper}
                      sx={{ backgroundColor: '#161d27', border: '1px solid #444' }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: '#ccc' }}>
                              <input
                                type="checkbox"
                                checked={
                                  filteredAgentConfigs.length > 0 &&
                                  selectedIds.length === displayedAgentConfigs.length
                                }
                                onChange={handleSelectAllAgents}
                              />
                            </TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Name</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Active</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Period</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Social Platform</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Source Type</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Source</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Date Created</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {displayedAgentConfigs.map((row, idx) => {
                            const isRowSelected = selectedIds.includes(row.id);
                            const isRowUpdating = rowUpdating[row.id] || false;
                            return (
                              <TableRow key={`${row.id}-${idx}`}>
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    checked={isRowSelected}
                                    onChange={() => handleSelectRowAgents(row.id)}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: '#66ccff' }}>
                                  <Link
                                    href="#"
                                    underline="hover"
                                    sx={{ color: '#66ccff', cursor: 'pointer' }}
                                  >
                                    {row.model_name}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  {isRowUpdating ? (
                                    <CircularProgress size={20} sx={{ color: '#ccc' }} />
                                  ) : (
                                    <Switch
                                      checked={!!row.is_active}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleToggleActive(row);
                                      }}
                                      sx={{
                                        '& .MuiSwitch-thumb': { color: row.is_active ? 'green' : 'red' },
                                        '& .MuiSwitch-track': {
                                          backgroundColor: row.is_active ? 'green' : 'red',
                                        },
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell sx={{ color: '#ccc' }}>{row.active_period}</TableCell>
                                <TableCell sx={{ color: '#ccc' }}>{row.active_period}</TableCell>
                                <TableCell sx={{ color: '#ccc' }}>{row.source_name_id}</TableCell>
                                <TableCell>
                                  <a
                                    href={`/transcribed/${row.id}`}
                                    style={{ color: '#66ccff', textDecoration: 'none' }}
                                  >
                                    <MoreVertIcon />
                                  </a>
                                </TableCell>
                                <TableCell sx={{ color: '#ccc' }}>
                                  {dayjs(row.createdAt).format('MMM D, YYYY h:mm A')}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  {filteredAgentConfigs.length > 0 && (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}
                    >
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        Showing {startACIndex + 1}–
                        {startACIndex + displayedAgentConfigs.length} of {filteredAgentConfigs.length}
                      </Typography>
                      <Pagination
                        count={Math.ceil(filteredAgentConfigs.length / rowsPerPageAgentConfig)}
                        page={pageAgentConfig}
                        onChange={handleChangePageAgentConfig}
                        sx={{
                          color: '#ccc',
                          '.MuiPaginationItem-root': { color: '#ccc', borderColor: '#444' },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </CardContent>
      </Box>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>
          Edit Agent Post Request:
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Update the content below:
          </Typography>
          <Box>
            <textarea
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#222',
                color: '#ccc',
                border: '1px solid #444',
                padding: '8px',
                fontFamily: 'inherit',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button startIcon={<CancelIcon />} onClick={() => setOpenEditDialog(false)} sx={buttonSx}>
            Cancel
          </Button>
          <Button startIcon={<SaveIcon />} onClick={handleSave} sx={buttonSx}>
            Save &amp; Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={chunkEditDialogOpen}
        onClose={() => setChunkEditDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>
          Edit Chunk Summary
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Update the chunk summary below:
          </Typography>
          <Box>
            <textarea
              rows={5}
              value={chunkEditValue}
              onChange={(e) => setChunkEditValue(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#222',
                color: '#ccc',
                border: '1px solid #444',
                padding: '8px',
                fontFamily: 'inherit',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button
            startIcon={<CancelIcon />}
            onClick={() => setChunkEditDialogOpen(false)}
            sx={buttonSx}
          >
            Cancel
          </Button>
          <Button startIcon={<SaveIcon />} onClick={handleSaveChunk} sx={buttonSx}>
            Save &amp; Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={chunkViewOpen}
        onClose={() => setChunkViewOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #444',
            color: '#ccc'
          }}
        >
          <span>Source summary: from agent: {chunkViewAgentName}</span>
          <IconButton
            onClick={handleCopyAllChunks}
            sx={{
              color: '#ccc',
              border: '1px solid #444'
            }}
          >
            <FileCopyIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            maxHeight: '400px',
            overflowY: 'auto',
            backgroundColor: '#161d27',
            color: '#ccc',
            borderTop: '1px solid #444',
            borderBottom: '1px solid #444',
            p: 2
          }}
        >
          {chunkViewData.map((chunk, idx) => (
            <Box
              key={idx}
              sx={{
                mb: 2,
                border: '1px solid #444',
                backgroundColor: '#1f2630',
                color: '#ccc',
                p: 2
              }}
            >
              <Typography variant="body2">{chunk}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button
            startIcon={<CancelIcon />}
            onClick={() => setChunkViewOpen(false)}
            sx={buttonSx}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDialogCancel}
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#ccc' }}>
            Are you sure you want to delete {selectedIds.length} selected record(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button onClick={handleDialogCancel} sx={buttonSx} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="error" sx={buttonSx} startIcon={<DeleteForeverIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRemoveProductDialog}
        onClose={handleCancelRemoveProduct}
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>Remove Product</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#ccc' }}>
            Are you sure you want to remove this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button onClick={handleCancelRemoveProduct} sx={buttonSx} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleConfirmRemoveProduct} color="error" sx={buttonSx} startIcon={<DeleteForeverIcon />}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpenK}
        onClose={handleCancelDeleteK}
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#ccc' }}>
            Are you sure you want to delete {selectedRowsK.length} selected record(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button onClick={handleCancelDeleteK} sx={buttonSx} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteK} color="error" sx={buttonSx} startIcon={<DeleteForeverIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isSummaryDialogOpen}
        onClose={() => {
          setIsSummaryDialogOpen(false);
          setDialogSummaryRow(null);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #444', color: '#ccc' }}>Summarize Text</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, color: '#ccc' }}>
            Choose an Agent and type to summarize your text.
          </DialogContentText>
          <FormControl sx={{ minWidth: 120, mb: 2 }} size="small">
            <InputLabel sx={{ color: '#ccc' }}>Select Agent</InputLabel>
            <Select
              label="Select Agent"
              value={selectedSummarizeAgent}
              onChange={(e) => setSelectedSummarizeAgent(e.target.value)}
              sx={{ color: '#ccc', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }}
            >
              {agentConfigs.map((agent, idx) => (
                <MenuItem key={`${agent.id}-${idx}`} value={agent.id}>
                  {agent.model_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <RadioGroup
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            sx={{ mb: 2, color: '#ccc' }}
          >
            <FormControlLabel value="long" control={<Radio sx={{ color: '#ccc' }} />} label="Long Summary" />
            <FormControlLabel value="short" control={<Radio sx={{ color: '#ccc' }} />} label="Short Summary" />
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #444' }}>
          <Button
            startIcon={<CancelIcon />}
            onClick={() => {
              setIsSummaryDialogOpen(false);
              setDialogSummaryRow(null);
            }}
            sx={buttonSx}
          >
            Cancel
          </Button>
          <Button
            startIcon={<SendIcon />}
            onClick={async () => {
              if (!dialogSummaryRow) return;
              await doSummarizeKnowledge(
                dialogSummaryRow.id,
                selectedSummarizeAgent,
                summaryType,
                setKnowledgeLoading,
                setKnowledgeData,
                setSuccessMsg,
                setErrorMsg
              );
              setIsSummaryDialogOpen(false);
              setDialogSummaryRow(null);
            }}
            sx={buttonSx}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Agents;
