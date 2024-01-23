import axios from 'axios';

const Instance = axios.create({
    baseURL: "https://server.demo.sas.com",
    headers:{}
});

export default Instance;