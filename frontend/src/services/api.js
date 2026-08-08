const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (_err) {

    throw new Error(`API Request failed: Server returned an invalid response (Status ${response.status})`);
  }
  if (!response.ok || !data.success) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=1';
      }
    }
    throw new Error(data.error || `API Request failed (Status ${response.status})`);
  }
  return data.data;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(res);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }));
    return data;
  },

  async register(name, email, password, role) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      // localStorage held corrupt JSON — clear it so the user gets a clean login screen
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  },

  // Scholarships
  async getScholarships() {
    const res = await fetch(`${API_BASE}/scholarships`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Applications (Student)
  async getStudentApplications() {
    const res = await fetch(`${API_BASE}/applications/student`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getApplication(id) {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createApplication(applicationData) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    });
    return handleResponse(res);
  },

  async uploadDocument(applicationId, documentType, file) {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/applications/${applicationId}/documents`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData
    });
    return handleResponse(res);
  },

  async cancelApplication(applicationId) {
    const res = await fetch(`${API_BASE}/applications/${applicationId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async submitApplication(applicationId) {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/submit`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Officer
  async getOfficerDashboard() {
    const res = await fetch(`${API_BASE}/officer/applications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async takeOfficerAction(applicationId, action, comments) {
    const res = await fetch(`${API_BASE}/officer/applications/${applicationId}/action`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, comments })
    });
    return handleResponse(res);
  },

  async askOfficerCopilot(applicationId, question) {
    const res = await fetch(`${API_BASE}/officer/applications/${applicationId}/copilot-chat`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    });
    return handleResponse(res);
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
