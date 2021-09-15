import axios from 'axios';

const Instance = axios.create({
    baseURL: "https://live.stable.gel.race.sas.com",
    headers:{}
});

export default Instance;