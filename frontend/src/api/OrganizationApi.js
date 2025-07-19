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

    static create = async (data) => {
        const url = `${config.url.api}/organizations`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static update = async (id, data) => {
        const url = `${config.url.api}/organizations/${id}`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) {
            throw json;
        }
        return json;
    }

    static delete = async (id) => {
        const url = `${config.url.api}/organizations/${id}`;
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        if (!res.ok) {
            const json = await res.json();
            throw json;
        }
        return true;
    }
}