import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Accordion, AccordionSummary, AccordionDetails, Typography,
  IconButton, Avatar, TextField, CircularProgress, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import dayjs from 'dayjs';

import { getUserTranscribeData, getVideoData } from '../../../../core/api/auth';

const allowedKeys = ["view_count", "upload_date", "duration", "like_count", "comment_count", "px_def"];

const formatDetail = (key, value) => {
  if (value == null) return '-';
  if (key === 'upload_date') {
    return dayjs(value).isValid() ? dayjs(value).format('MMM D, YYYY') : value;
  } else if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
};

const truncateString = (str, num) => {
  if (!str) return '-';
  return str.length <= num ? str : str.slice(0, num) + '...';
};

export default function Transcribed() {
  const { id } = useParams();
  const [transcribedData, setTranscribedData] = useState(null);
  const [videoDetailsData, setVideoDetailsData] = useState(null);
  const [videoDetailsLoading, setVideoDetailsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    fetchTranscribedData();
  }, []);

  const fetchTranscribedData = async () => {
    try {
      const resp = await getUserTranscribeData(id);
      setTranscribedData(resp.result || null);
      if (resp.result?.video_id) {
        await fetchVideoDetails(id);
      }
    } catch (err) {
      console.error('Error fetching transcribed data:', err);
      setTranscribedData(null);
    }
  };

  const fetchVideoDetails = async (vidId) => {
    setVideoDetailsLoading(true);
    try {
      const resp = await getVideoData(vidId);
      const details = resp.result;
      setVideoDetailsData(Array.isArray(details) ? details : [details]);
    } catch (err) {
      console.error('Error fetching video details:', err);
    } finally {
      setVideoDetailsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcribedData.original_texts || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUrlCopy = () => {
    navigator.clipboard.writeText(transcribedData.youtube_channel_id || '');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };

  const getCharCount = (text) => {
    if (!text) return 0;
    return text.length;
  };

  let summaryItems = [];
  if (transcribedData?.transcript_summary) {
    try {
      const parsed = JSON.parse(transcribedData.transcript_summary);
      summaryItems = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      summaryItems = [transcribedData.transcript_summary];
    }
  }

  return (
    <Box sx={{ p: 2, overflow: 'hidden', backgroundColor: '#161d27', color: '#ccc', minHeight: '100vh' }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#ccc' }}>
              Transcription Details:
            </Typography>
          </Grid>
        </Grid>
      {!transcribedData ? (
        <Typography>No transcription data available.</Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography
              component={RouterLink}
              to="/addTranscribe"
              sx={{ textDecoration: 'none', color: '#66ccff', display: 'flex', alignItems: 'center' }}
            >
              <ArrowBackIosNewIcon sx={{ color: '#fff' }} />
            </Typography>
            {transcribedData.channel_logo_url ? (
              <Avatar src={transcribedData.channel_logo_url} sx={{ width: 24, height: 24 }} />
            ) : (
              <YouTubeIcon sx={{ color: 'red' }} />
            )}
            <Typography sx={{ color: '#ccc', fontWeight: 'bold' }}>
              {transcribedData.transcript_title}
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {videoDetailsLoading ? (
              <CircularProgress size={20} sx={{ color: '#fff', ml: 2 }} />
            ) : (
              transcribedData.video_id ? (
                videoDetailsData && videoDetailsData.length > 0 && allowedKeys.map((k) => (
                  <Grid item xs={4} sm={2} key={k}>
                    <Box sx={{ textAlign: 'center', backgroundColor: '#1f2833', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#aaa' }}>
                        {k.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {formatDetail(k, videoDetailsData[0][k])}
                      </Typography>
                    </Box>
                  </Grid>
                ))
              ) : (
                <>
                  <Grid item xs={4} sm={2}>
                    <Box sx={{ textAlign: 'center', backgroundColor: '#1f2833', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#aaa' }}>WORD COUNT</Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {getWordCount(transcribedData.original_texts)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <Box sx={{ textAlign: 'center', backgroundColor: '#1f2833', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#aaa' }}>CHARACTER COUNT</Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {getCharCount(transcribedData.original_texts)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <Box sx={{ position: 'relative', textAlign: 'center', backgroundColor: '#1f2833', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#aaa' }}>URL</Typography>
                      <IconButton
                        onClick={handleUrlCopy}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          color: copiedUrl ? 'green' : '#fff'
                        }}
                      >
                        <FileCopyIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold', wordBreak: 'break-all', mt: 1 }}>
                        {truncateString(transcribedData.youtube_channel_id, 20)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <Box sx={{ textAlign: 'center', backgroundColor: '#1f2833', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#aaa' }}>STATE</Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {transcribedData.state || '-'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <Box sx={{ textAlign: 'center', backgroundColor: '#1f2833', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#aaa' }}>DATE CREATED</Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {dayjs(transcribedData.created_at).isValid() ? dayjs(transcribedData.created_at).format('MMM D, YYYY') : transcribedData.created_at}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )
            )}
          </Grid>

          <Accordion sx={{ backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc', mb: 2 }} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ccc' }} />}>
              <Typography>Original Content</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <IconButton onClick={handleCopy} sx={{ color: copied ? 'green' : '#fff', float: 'right' }}>
                <FileCopyIcon fontSize="small" />
              </IconButton>
              <TextField
                multiline
                fullWidth
                minRows={10}
                maxRows={15}
                value={transcribedData.original_texts || ''}
                sx={{ backgroundColor: '#161d27', '& .MuiInputBase-input': { color: '#ccc' } }}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ccc' }} />}>
              <Typography>Text Summary</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ whiteSpace: 'pre-wrap', color: '#ccc' }}>
                {summaryItems.map((item, idx) => (
                  <Box key={idx} sx={{ mb: 1 }}>{JSON.stringify(item)}</Box>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
}
