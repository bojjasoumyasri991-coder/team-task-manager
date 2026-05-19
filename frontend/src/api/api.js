import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-tr16.onrender.com",
});

export default API;