const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error("Session expired. Please login again.");
    }

    if (response.status === 204) return null;

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(data || "Something went wrong.");
    }

    return data;
};

const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // Auth
    login: async (email, password) => {
        const res = await fetch('/api/Auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return handleResponse(res);
    },
    register: async (formData) => {
        // formData is a FormData object to handle file upload
        const res = await fetch('/api/Auth/register', {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        });
        return handleResponse(res);
    },
    getMe: async () => {
        const res = await fetch('/api/Auth/me', { headers: getHeaders() });
        return handleResponse(res);
    },
    getUsers: async () => {
        const res = await fetch('/api/Auth/users', { headers: getHeaders() });
        return handleResponse(res);
    },

    // Posts
    getPosts: async () => {
        const res = await fetch('/api/Post', { headers: getHeaders() });
        return handleResponse(res);
    },
    createPost: async (dto) => {
        const res = await fetch('/api/Post', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(dto)
        });
        return handleResponse(res);
    },
    deletePost: async (id) => {
        const res = await fetch(`/api/Post/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(res);
    },

    // Comments
    getComments: async (postId) => {
        const res = await fetch(`/api/Comment/post/${postId}`, { headers: getHeaders() });
        return handleResponse(res);
    },
    createComment: async (dto) => {
        const res = await fetch('/api/Comment', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(dto)
        });
        return handleResponse(res);
    },
    deleteComment: async (id) => {
        const res = await fetch(`/api/Comment/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(res);
    },

    // Messages
    getConversation: async (userId) => {
        const res = await fetch(`/api/Message/${userId}`, { headers: getHeaders() });
        return handleResponse(res);
    },
    sendMessage: async (dto) => {
        const res = await fetch('/api/Message', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(dto)
        });
        return handleResponse(res);
    },
    unsendMessage: async (id) => {
        const res = await fetch(`/api/Message/unsend/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(res);
    }
};
