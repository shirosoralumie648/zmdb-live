import config from '../config';

export default class OrganizationsApi {

    static findAll = async () => {
        const url = `${config.url.api}/organizations`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }
}