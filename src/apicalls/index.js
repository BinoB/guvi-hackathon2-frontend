import axios from 'axios';

export const axiosInstance = axios.create({
  proxy : 'https://guvi-hackathon2.onrender.com',
      headers : {
        'Content-Type': 'application/json',
        authorization : `Bearer ${localStorage.getItem('token')}`
      }
});