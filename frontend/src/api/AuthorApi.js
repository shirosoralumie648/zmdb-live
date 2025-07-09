import config from '../config';

export default class AuthorApi {

    static findByOrganizationId = async (organizationId) => {
        const url = `${config.url.api}/organizations/${organizationId}/authors`;
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