import axios from 'axios';

const Instance = axios.create({
    baseURL: "https://live.lts.gel.race.sas.com",
    headers:{}
});

export default Instance;