import axios from "axios";

export default axios.create({
  baseURL: "http://149.28.162.179:5000",
  headers: {
    "Content-type": "application/json"
  }
});
