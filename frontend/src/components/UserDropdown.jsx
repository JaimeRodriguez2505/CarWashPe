import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Settings, LogOut } from 'lucide-react';

const UserDropdown = ({ user, onLogout, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      transition: {
        type: 'tween',
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 0.2
      }
    }
  };

  const renderDropdownContent = () => (
    <motion.div
      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ${isMobile ? 'relative mt-0 w-full' : ''}`}
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Link 
        to="/profile" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => setIsOpen(false)}
      >
        <User className="inline-block w-4 h-4 mr-2" />
        Mi Perfil
      </Link>
      <Link 
        to="/settings" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => setIsOpen(false)}
      >
        <Settings className="inline-block w-4 h-4 mr-2" />
        Configuración
      </Link>
      <Link 
        to="/card" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => setIsOpen(false)}
      >
        <User className="inline-block w-4 h-4 mr-2" />
        Mis Tarjetas
      </Link>
      <button 
        onClick={onLogout} 
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <LogOut className="inline-block w-4 h-4 mr-2" />
        Cerrar Sesión
      </button>
    </motion.div>
  );

  if (isMobile) {
    return (
      <div className="px-3 py-2">
        <button
          onClick={toggleDropdown}
          className="flex items-center w-full text-left rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 transition duration-150 ease-in-out"
        >
          <User className="w-5 h-5 mr-2" />
          {user?.username || 'Usuario'}
          <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && renderDropdownContent()}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-800 transition duration-150 ease-in-out"
      >
        <User className="w-5 h-5" />
        <span>{user?.username || 'Usuario'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && renderDropdownContent()}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;

