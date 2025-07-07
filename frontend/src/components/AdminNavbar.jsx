import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Home, BarChart2, Users, MessageSquare, Building, Shield, User, Crown, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const adminMenuItems = [
    { to: '/admin', icon: <BarChart2 className="w-4 h-4 mr-2" />, label: 'Dashboard' },
    { to: '/admin/usuarios', icon: <Users className="w-4 h-4 mr-2" />, label: 'Usuarios' },
    { to: '/admin/reclamos', icon: <MessageSquare className="w-4 h-4 mr-2" />, label: 'Reclamos' },
    { to: '/companies', icon: <Building className="w-4 h-4 mr-2" />, label: 'Mi Empresa' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-red-200/50 sticky top-0 z-[100]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/admin" className="flex items-center text-2xl font-bold bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent hover:from-red-600 hover:via-red-700 hover:to-red-800 transition-all duration-500">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mr-3 p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
              >
                <Crown className="w-8 h-8 text-white" />
              </motion.div>
              <div className="flex items-center">
                <span>CarWash</span>
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    color: ['#dc2626', '#b91c1c', '#dc2626']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-red-600 ml-1"
                >
                  Pe
                </motion.span>
                <motion.span
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2 px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full font-bold shadow-lg"
                >
                  ADMIN
                </motion.span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            {adminMenuItems.map((item) => (
              <AdminNavLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                isActive={isActive(item.to)}
              >
                {item.label}
              </AdminNavLink>
            ))}
            
            {/* User dropdown area */}
            <div className="relative ml-4 flex items-center space-x-4">
              <motion.div 
                className="flex items-center text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-red-200"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                transition={{ duration: 0.3 }}
              >
                <User className="w-4 h-4 mr-2 text-red-600" />
                <span className="text-sm font-semibold">
                  {user?.username || 'Admin'}
                </span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </motion.button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-3 rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 shadow-lg"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="block h-6 w-6" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 z-[150]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pt-4 pb-6 space-y-3 bg-white/80 backdrop-blur-xl shadow-2xl border-t border-red-200/50 border-b border-red-200/50">
              {adminMenuItems.map((item) => (
                <AdminMobileNavLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  isActive={isActive(item.to)}
                >
                  {item.label}
                </AdminMobileNavLink>
              ))}
              
              {/* Mobile user info and logout */}
              <div className="pt-4 pb-2 border-t border-red-200/50">
                <motion.div 
                  className="flex items-center px-4 py-3 text-gray-700 bg-white/60 backdrop-blur-sm rounded-xl mb-3 border border-red-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <User className="w-4 h-4 mr-2 text-red-600" />
                  <span className="text-sm font-semibold">
                    {user?.username || 'Admin'}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const AdminNavLink = ({ to, children, icon, isActive }) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -2 }} 
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
        isActive 
          ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg' 
          : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
      }`}
    >
      {icon}
      {children}
      <motion.div
        className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 opacity-100' 
            : 'bg-gradient-to-r from-red-500/10 to-red-600/10 hover:opacity-100'
        }`}
        initial={false}
      />
    </Link>
  </motion.div>
);

const AdminMobileNavLink = ({ to, children, icon, isActive }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Link
      to={to}
      className={`flex items-center block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
        isActive 
          ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg' 
          : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
      }`}
    >
      {icon}
      {children}
    </Link>
  </motion.div>
);

export default AdminNavbar; 