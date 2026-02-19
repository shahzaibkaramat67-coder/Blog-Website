import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const vettlyApi = axios.create({
  baseURL: "https://api.vettly.dev/v1", // base URL
  headers: {
    Authorization: `Bearer ${process.env.VETTLY_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default vettlyApi;
