import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LogIn, UserPlus, Building, CreditCard, Home, Sparkles, Zap } from 'lucide-react';
import api from '../api';
import UserDropdown from './UserDropdown';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const companyResponse = await api.get('/api/empresas/');
          if (companyResponse.data.length > 0) {
            setCompanyId(companyResponse.data[0].id);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            <Link to="/" className="flex items-center text-2xl font-bold bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent hover:from-red-600 hover:via-red-700 hover:to-red-800 transition-all duration-500">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mr-3 p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
              >
                <Home className="w-8 h-8 text-white" />
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
              </div>
            </Link>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" icon={<Home className="w-4 h-4 mr-2" />}>Inicio</NavLink>
            {user && (
              <>
                <NavLink to="/companies" icon={<Building className="w-4 h-4 mr-2" />}>Mi Empresa</NavLink>
                <NavLink to="/plans" icon={<CreditCard className="w-4 h-4 mr-2" />}>Planes</NavLink>
              </>
            )}
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} />
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrarse
                  </Link>
                </motion.div>
              </>
            )}
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
              <MobileNavLink to="/" icon={<Home className="w-4 h-4 mr-2" />}>Inicio</MobileNavLink>
              {user && (
                <>
                  <MobileNavLink to="/companies" icon={<Building className="w-4 h-4 mr-2" />}>Mi Empresa</MobileNavLink>
                  <MobileNavLink to="/plans" icon={<CreditCard className="w-4 h-4 mr-2" />}>Planes</MobileNavLink>
                </>
              )}
              {user ? (
                <>
                  <UserDropdown user={user} onLogout={handleLogout} isMobile={true} />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/login"
                      className="flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/register"
                      className="flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 transition-all duration-300 shadow-lg"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Registrarse
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLink = ({ to, children, className = '', icon }) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -2 }} 
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 ${className}`}
    >
      {icon}
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </Link>
  </motion.div>
);

const MobileNavLink = ({ to, children, className = '', icon }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Link
      to={to}
      className={`flex items-center block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 ${className}`}
    >
      {icon}
      {children}
    </Link>
  </motion.div>
);

export default Navbar;

