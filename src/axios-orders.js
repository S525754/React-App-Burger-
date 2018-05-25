import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-building-app.firebaseio.com/'
});

export default instance;