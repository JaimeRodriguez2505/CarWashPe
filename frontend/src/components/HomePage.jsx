import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ClipboardList, BarChart2, Clock, DollarSign, Car, Zap, Shield, TrendingUp, Star, ArrowRight, CheckCircle, Sparkles, Waves, Droplets, Crown, Users, Award, Target, Building } from 'lucide-react';

const HomePage = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <ClipboardList className="w-12 h-12" />,
      title: "Registro de Servicios",
      description: "Registra fácilmente cada lavado de auto con detalles completos y seguimiento en tiempo real",
      color: "from-red-500 to-red-600",
      benefits: ["Captura rápida de datos", "Historial detallado", "Fotos del vehículo"]
    },
    {
      icon: <BarChart2 className="w-12 h-12" />,
      title: "Estadísticas Detalladas",
      description: "Visualiza tus ganancias diarias, semanales y mensuales con gráficos interactivos",
      color: "from-red-600 to-red-700",
      benefits: ["Reportes en tiempo real", "Gráficos interactivos", "Análisis de tendencias"]
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Historial Completo",
      description: "Mantén un registro histórico de todos los servicios realizados con búsqueda avanzada",
      color: "from-red-700 to-red-800",
      benefits: ["Búsqueda avanzada", "Filtros personalizados", "Exportación de datos"]
    },
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "Control de Ingresos",
      description: "Gestiona y analiza tus ingresos de manera efectiva con reportes personalizados",
      color: "from-red-500 to-red-600",
      benefits: ["Control de caja", "Reportes financieros", "Análisis de rentabilidad"]
    }
  ];

  const benefits = [
    "Registro rápido y eficiente",
    "Estadísticas en tiempo real",
    "Interfaz intuitiva y moderna",
    "Soporte técnico 24/7",
    "Actualizaciones automáticas",
    "Seguridad de datos garantizada"
  ];

  const stats = [
    { number: "500+", label: "Empresas activas", icon: <Building className="w-6 h-6" /> },
    { number: "50K+", label: "Servicios registrados", icon: <Car className="w-6 h-6" /> },
    { number: "99.9%", label: "Tiempo de actividad", icon: <Shield className="w-6 h-6" /> },
    { number: "24/7", label: "Soporte disponible", icon: <Users className="w-6 h-6" /> }
  ];

  // Efecto para rotar características automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Efecto para partículas flotantes
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-red-400/20 rounded-full pointer-events-none';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = '100%';
      particle.style.animation = `float ${Math.random() * 3 + 2}s linear infinite`;
      document.querySelector('.particle-container')?.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    };

    const interval = setInterval(createParticle, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-red-100">
      {/* Partículas flotantes */}
      <div className="particle-container absolute inset-0 overflow-hidden pointer-events-none" />
      
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
              y: [0, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="inline-flex items-center justify-center mb-8 p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20 rounded-3xl"
            />
            <Car className="w-16 h-16 text-white relative z-10" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent"
          >
            Gestión Profesional
            <br />
            <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              para tu CarWash
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl mb-12 text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            Optimiza tu negocio con nuestro sistema avanzado de registro y estadísticas
            <br />
            <span className="text-red-600 font-semibold">Tecnología de vanguardia para el éxito de tu empresa</span>
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl relative overflow-hidden"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20"
                />
                <Zap className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Comenzar Prueba Gratuita</span>
                <ArrowRight className="w-5 h-5 ml-2 relative z-10" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-xl border-2 border-red-300 text-red-700 text-lg font-bold rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-2xl"
              >
                <Shield className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Link>
            </motion.div>
          </motion.div>

          {/* Beneficios rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 text-gray-700 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-red-200"
              >
                <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Estadísticas */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-flex items-center justify-center mb-4 p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl"
                >
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-bold text-red-700 mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent">
              Todo lo que necesitas para tu CarWash
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Herramientas profesionales diseñadas específicamente para optimizar tu negocio de lavado de autos
            </p>
          </motion.div>
          
          {/* Característica destacada */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-red-200 relative overflow-hidden">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-600/5 to-red-400/5 rounded-3xl blur-xl"
              />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`flex-shrink-0 p-6 bg-gradient-to-r ${features[currentFeature].color} rounded-2xl shadow-lg`}
                >
                  <div className="text-white">
                    {features[currentFeature].icon}
                  </div>
                </motion.div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-red-700">{features[currentFeature].title}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{features[currentFeature].description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {features[currentFeature].benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Todas las características */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-red-200 hover:border-red-300 transition-all duration-500 shadow-2xl hover:shadow-3xl relative overflow-hidden">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={`mb-6 flex justify-center p-4 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg`}
                  >
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 text-red-700">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                  
                  {/* Efecto de brillo en hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/10 to-red-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-12 shadow-2xl border border-red-200 relative overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex items-center justify-center mb-8 p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
            >
              <Star className="w-12 h-12 text-white" />
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              ¿Listo para transformar tu negocio?
            </h3>
            <p className="text-xl text-red-100 mb-8">
              Únete a cientos de empresarios que ya confían en CarWashPe para gestionar sus operaciones
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-flex items-center px-10 py-4 bg-white text-red-700 text-xl font-bold rounded-2xl hover:bg-red-50 transition-all duration-300 shadow-2xl relative overflow-hidden"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20"
                />
                <TrendingUp className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">Comenzar Ahora</span>
                <ArrowRight className="w-6 h-6 ml-3 relative z-10" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Estilos CSS para las partículas */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;

