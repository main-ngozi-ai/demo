import axios from 'axios';
import { signOut } from "firebase/auth";
import { auth } from './config/firebase.js';

const API_URL = 'https://d18mr47p2qo1sw.cloudfront.net/api';

export const login = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { user_profile: user });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const saveYoutubeData = async (data, agent_id) => {
  try {
    const response = await axios.post(`${API_URL}/saveYoutubeData`, { data: data, agent_id: agent_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLanguageModels = async () => {
  try{
    const response = await axios.post(`${API_URL}/getLanguageModels`, { });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }  
}

export const getRandomAgentActivities = async () => {
  try{
    const response = await axios.post(`${API_URL}/getRandomAgentActivities`, { });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }  
}

export const getAgentKnowledgeSource = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/getAgentKnowledgeSource`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAgentChartData = async (type, user_id, agent_id) => {
  try {
    const response = await axios.post(`${API_URL}/getAgentChartData`, { type, user_id, agent_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllUserTranscribeData = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/getAllUserTranscribeData`, { user_id: userId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getUserTranscribeData = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/getUserTranscribeData`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const quickYoutubeTranscribe = async (inputValue, user_id) => {
  try {
    const response = await axios.post(`${API_URL}/quickYoutubeTranscribe`, { link: inputValue, user_id: user_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const makeFreeYoutubeVideoGif = async (link, time, user_id) => {
  try {
    console.log(link, time, user_id);
    const response = await axios.post(`${API_URL}/makeFreeYoutubeVideoGif`, { link: link, time: time, user_id: user_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const checkGifResult = async (user_id) => {
  try {
    const response = await axios.post(`${API_URL}/checkGifResult`, { user_id: user_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getYoutubeVideoDetails = async (inputValue) => {
  try {
    const response = await axios.post(`${API_URL}/getYoutubeVideoDetails`, { value: inputValue });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const summarizeTranscribeApi = async (id, agentId, summaryType) => {
  try {
    const response = await axios.post(`${API_URL}/summarizeTranscribeApi`, { id: id, agentId: agentId, summaryType: summaryType });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const retryTranscribeVideo = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/retryTranscribe`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteTranscribe = async (selectedRows) => {
  try {
    const response = await axios.post(`${API_URL}/deleteTranscribe`, { ids: selectedRows });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getVideoData = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/getVideoData`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getYoutubeChannelListsByCategory = async (value) => {
  try {
    const response = await axios.post(`${API_URL}/getYoutubeChannelListsByCategory`, { value: value });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAgentDetails = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/getAgentDetails`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCharacter = async () => {
  try {
    const response = await axios.post(`${API_URL}/getCharacter`, { });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAgentConfigExist = async (userId, agentId, source, secondary, activePeriod, configPayload) => {
  try {
    const response = await axios.post(`${API_URL}/getAgentConfigExist`,
       { userId: userId, agentId: agentId, source: source, secondary: secondary,
         activePeriod: activePeriod, configPayload: configPayload });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateAgentConfigActive = async (recordId, newValue) => {
  try {
    const response = await axios.post(`${API_URL}/updateAgentConfigActive`, { recordId: recordId, newValue: newValue });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAgents = async (user_id) => {
  try {
    const response = await axios.post(`${API_URL}/getAgents`, { id: user_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserSourceType = async (type, user_id) => {
  try {
    const response = await axios.post(`${API_URL}/getUserSourceType`, { type: type, user_id: user_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteSelectedConfig = async (ids) => {
  try {
    const response = await axios.post(`${API_URL}/deleteSelectedConfig`, { ids: ids });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const saveScrapValue = async (value) => {
  try {
    const response = await axios.post(`${API_URL}/saveScrapValue`, { value: value });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSelectedAgent = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/getSelectedAgent`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loadSavedAgent = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/loadSavedAgent`, { idz: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAgentShopProducts = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/getAgentShopProducts`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteAgentShop = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/deleteAgentShop`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const saveShopAndProduct = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/saveShopAndProduct`, { data: formData });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUserProduct = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/deleteUserProduct`, { id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAgentPosts = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/getAgentPosts`, { agent_id: id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const approveOrRejectPost = async (post_id, decision) => {
  try {
    const response = await axios.post(`${API_URL}/approveOrRejectPost`, { post_id: post_id, decision: decision });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const saveAgentControl = async (dataToSave) => {
  try {
    const response = await axios.post(`${API_URL}/saveAgentControl`, { dataToSave: dataToSave });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getActions = async () => {
  try {
    const response = await axios.post(`${API_URL}/getActions`, { });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loadAgentAction = async (agent_id) => {
  try {
    const response = await axios.post(`${API_URL}/loadAgentAction`, {  agent_id: agent_id});
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteAgentAction = async (selected_agent, g_id, user_id) => {
  try {
    const response = await axios.post(`${API_URL}/deleteAgentAction`,
       {  selected_agent: selected_agent, g_id: g_id, user_id: user_id});
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem('authToken');
  sessionStorage.clear();
  window.location.href = '/';
};

export const getAgentChannels = async (user_id) => {
  try {
    const response = await axios.post(`${API_URL}/getAgentChannels`, { user_id: user_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteAgentById = async (agent_id, user_id) => {
  try {
    const response = await axios.post(`${API_URL}/deleteAgentById`, { user_id: user_id, agent_id: agent_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteChannelById = async (id, channel_id) => {
  try {
    const response = await axios.post(`${API_URL}/deleteChannelById`, { id: id, channel_id: channel_id });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};