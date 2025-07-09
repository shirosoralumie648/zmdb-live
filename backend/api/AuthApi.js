import axios from 'axios';
import config from '../config.js';

export default class AuthApi {
    
    static auth = async (token) => {
        const url = `${config.zimu.auth.url}/auth`;

        return (await axios.post(url, {}, {
            headers: {
                'Authorization': token
            }
        })).data;
    }
}