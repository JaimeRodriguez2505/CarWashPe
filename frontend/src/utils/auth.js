// Utilidades para manejo de autenticación
export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const getToken = () => {
  const user = getUser();
  return user?.token || null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isAdmin = () => {
  const user = getUser();
  return user?.is_staff || user?.is_superuser || false;
};

export const clearAuth = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
