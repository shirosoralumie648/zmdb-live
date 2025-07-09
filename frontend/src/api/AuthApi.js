import config from '../config';

export default class AuthApi {
    static login = async (username, password) => {
        const url = `${config.url.api}/auth/login`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}
