import api from './api';

// -------------------------------
// LOGIN (Password never returned)
// -------------------------------
export const login = async (email, password) => {
  try {
    const response = await api.get('/users');

    // Validate credentials
    const user = response.data.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Remove password from returned user object
    const { password: _, ...safeUser } = user;

    return safeUser.id;   // Only return ID to store in GlobalSave
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
};

// ------------------------------------------------------------
// GET CURRENT USER (Never return password)
// ------------------------------------------------------------
export const getCurrentUser = async (userId) => {
  try {
    const [userResponse, clientsResponse] = await Promise.all([
      api.get(`/users/${userId}`),
      api.get('/clients')
    ]);

    const userData = userResponse.data;
    const allClients = clientsResponse.data;

    // Remove password before returning
    const { password, ...cleanUserData } = userData;

    // Map client access
    const accessibleClients = allClients.filter(client =>
      cleanUserData.clientsAccess?.includes(client.clientCode)
    );

    return {
      ...cleanUserData,
      accessibleClients
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get current user');
  }
};

// --------------------
// LOGOUT
// --------------------
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// --------------------
// VERIFY TOKEN
// --------------------
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};
