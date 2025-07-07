import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Phone, Mail, MapPin, Heart, Shield, Zap, Star, Award, Users, Car } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-gradient-to-r from-white via-red-50 to-red-100 text-gray-800 py-16 border-t border-red-200/50 relative overflow-hidden"
    >
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg"
              >
                <Car className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent">
                CarWashPe
              </h3>
            </motion.div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Optimizando el lavado de autos en Perú con tecnología avanzada y servicio de calidad profesional.
            </p>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center text-red-600 text-sm font-semibold"
            >
              <Heart className="w-4 h-4 mr-2" />
              Hecho con pasión en Perú
            </motion.div>
            
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-red-200"
              >
                <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-red-700">500+</div>
                <div className="text-xs text-gray-600">Empresas</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-red-200"
              >
                <Star className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-red-700">4.9</div>
                <div className="text-xs text-gray-600">Rating</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h4 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Enlaces Rápidos
            </h4>
            <ul className="space-y-4">
              {[
                { to: "/about", label: "Sobre Nosotros", icon: <Award className="w-4 h-4" /> },
                { to: "/contact", label: "Contacto", icon: <Phone className="w-4 h-4" /> },
                { to: "/terms", label: "Términos de Servicio", icon: <Shield className="w-4 h-4" /> },
                { to: "/privacy", label: "Política de Privacidad", icon: <Shield className="w-4 h-4" /> }
              ].map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-gray-700 hover:text-red-600 transition-all duration-300 flex items-center group"
                  >
                    <motion.div
                      className="w-2 h-2 bg-red-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="mr-2 text-red-500 group-hover:text-red-600 transition-colors duration-300">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            <h4 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Contáctanos
            </h4>
            <ul className="space-y-4">
              {[
                { icon: <Phone className="w-5 h-5" />, text: "+51 123 456 789", label: "Teléfono" },
                { icon: <Mail className="w-5 h-5" />, text: "info@carwashpe.com", label: "Email" },
                { icon: <MapPin className="w-5 h-5" />, text: "Lima, Perú", label: "Ubicación" }
              ].map((contact, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: -5 }}
                  className="flex items-start space-x-4 p-3 bg-white/40 backdrop-blur-sm rounded-xl border border-red-200 hover:bg-white/60 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="text-red-600 mt-1"
                  >
                    {contact.icon}
                  </motion.div>
                  <div>
                    <div className="text-sm font-semibold text-red-700">{contact.label}</div>
                    <div className="text-gray-700">{contact.text}</div>
                  </div>
                </motion.li>
              ))}
            </ul>
            
            {/* Redes sociales */}
            <div className="pt-4">
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Síguenos</h5>
              <div className="flex space-x-4">
                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social, index) => (
                  <motion.div
                    key={social}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-sm font-bold">{social.charAt(0)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Línea divisoria */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="my-12 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-600 text-lg">
            &copy; 2024 CarWashPe. Todos los derechos reservados.
          </p>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center justify-center mt-4 text-red-600 text-sm font-semibold"
          >
            <Shield className="w-4 h-4 mr-2" />
            Seguro y confiable
          </motion.div>
          
          {/* Badges adicionales */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
            >
              <Shield className="w-3 h-3 mr-1" />
              SSL Seguro
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
            >
              <Star className="w-3 h-3 mr-1" />
              Certificado
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold"
            >
              <Heart className="w-3 h-3 mr-1" />
              Made in Perú
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
