import axios from 'axios';

const Instance = axios.create({
    baseURL: "https://livestg.stable.gel.race.sas.com",
    headers:{}
});

export default Instance;