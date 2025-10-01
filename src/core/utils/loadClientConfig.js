export const loadClientConfig = async () => {
  try{
    const API_URL = 'https://d18mr47p2qo1sw.cloudfront.net/api';
    const res = await fetch(`${API_URL}/clientConfig`);
    if (!res.ok) throw new Error('Could not load config');
    return res.json();
  } catch (error) {
    throw error.response.data;
  }  
}