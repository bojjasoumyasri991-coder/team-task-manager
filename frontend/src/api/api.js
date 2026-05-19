import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-trl6.onrender.com",
});

export default API;