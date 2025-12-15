import api from './api.js';

const userDropdownService = {
  async getUserMenuItems() {
    try {
      const response = await api.get('/userMenuItems');
      return response.data;
    } catch (error) {
      console.error('Error fetching user menu items:', error);
      throw error;
    }
  },
};

export default userDropdownService;
