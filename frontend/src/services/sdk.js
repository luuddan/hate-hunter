import axios from 'axios';

export default axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "https://backend-dot-crd-app-305909.uc.r.appspot.com" : "http://localhost:5000"
});