const API_URL = "http://localhost:5000";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { authorization: token })
    };
};

export const get = async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: getHeaders()
    });
    return res.json();
};

export const post = async (endpoint, body) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body)
    });
    return res.json();
};

export const put = async (endpoint, body) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body)
    });
    return res.json();
};

export const del = async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: getHeaders()
    });
    return res.json();
};

export default API_URL;