import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-6dd66.firebaseio.com/'
});

export default instance;