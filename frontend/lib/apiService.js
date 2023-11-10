import axios from 'axios';

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'access_token': 'your_access_token' // replace with your actual access token
  }
});

export default apiService;