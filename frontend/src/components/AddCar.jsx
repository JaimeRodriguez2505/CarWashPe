import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Plus, ArrowLeft, AlertCircle, Camera, Phone, Tag, Calendar, Palette, ChevronDown, ChevronUp, Check } from 'lucide-react';
import api from '../api';

const AddCar = () => {
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    numero_telefono: '',
    precio: '',
    estado: 'espera',
    dia_llegada: new Date().toISOString().split('T')[0],
  });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBrandPicker, setShowBrandPicker] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [customBrand, setCustomBrand] = useState('');
  const [customModel, setCustomModel] = useState('');
  const navigate = useNavigate();
  const { companyId } = useParams();

  // Datos predefinidos
  const colors = [
    { name: 'Blanco', value: 'blanco', hex: '#FFFFFF', icon: '⚪' },
    { name: 'Negro', value: 'negro', hex: '#000000', icon: '⚫' },
    { name: 'Gris', value: 'gris', hex: '#808080', icon: '🔘' },
    { name: 'Plateado', value: 'plateado', hex: '#C0C0C0', icon: '🔘' },
    { name: 'Azul', value: 'azul', hex: '#0000FF', icon: '🔵' },
    { name: 'Azul Marino', value: 'azul marino', hex: '#000080', icon: '🔵' },
    { name: 'Azul Cielo', value: 'azul cielo', hex: '#87CEEB', icon: '🔵' },
    { name: 'Rojo', value: 'rojo', hex: '#FF0000', icon: '🔴' },
    { name: 'Rojo Oscuro', value: 'rojo oscuro', hex: '#8B0000', icon: '🔴' },
    { name: 'Verde', value: 'verde', hex: '#008000', icon: '🟢' },
    { name: 'Verde Oscuro', value: 'verde oscuro', hex: '#006400', icon: '🟢' },
    { name: 'Verde Lima', value: 'verde lima', hex: '#32CD32', icon: '🟢' },
    { name: 'Amarillo', value: 'amarillo', hex: '#FFFF00', icon: '🟡' },
    { name: 'Amarillo Dorado', value: 'amarillo dorado', hex: '#FFD700', icon: '🟡' },
    { name: 'Naranja', value: 'naranja', hex: '#FFA500', icon: '🟠' },
    { name: 'Naranja Oscuro', value: 'naranja oscuro', hex: '#FF8C00', icon: '🟠' },
    { name: 'Morado', value: 'morado', hex: '#800080', icon: '🟣' },
    { name: 'Violeta', value: 'violeta', hex: '#8A2BE2', icon: '🟣' },
    { name: 'Marrón', value: 'marrón', hex: '#8B4513', icon: '🟤' },
    { name: 'Marrón Claro', value: 'marrón claro', hex: '#D2691E', icon: '🟤' },
    { name: 'Rosa', value: 'rosa', hex: '#FFC0CB', icon: '🩷' },
    { name: 'Rosa Oscuro', value: 'rosa oscuro', hex: '#FF1493', icon: '🩷' },
    { name: 'Dorado', value: 'dorado', hex: '#FFD700', icon: '🟡' },
    { name: 'Bronce', value: 'bronce', hex: '#CD7F32', icon: '🟤' },
    { name: 'Cobre', value: 'cobre', hex: '#B87333', icon: '🟠' },
    { name: 'Champagne', value: 'champagne', hex: '#F7E7CE', icon: '⚪' },
    { name: 'Beige', value: 'beige', hex: '#F5F5DC', icon: '⚪' },
    { name: 'Cremoso', value: 'cremoso', hex: '#FFFDD0', icon: '⚪' },
    { name: 'Turquesa', value: 'turquesa', hex: '#40E0D0', icon: '🔵' },
    { name: 'Índigo', value: 'índigo', hex: '#4B0082', icon: '🟣' },
    { name: 'Coral', value: 'coral', hex: '#FF7F50', icon: '🟠' },
    { name: 'Salmón', value: 'salmón', hex: '#FA8072', icon: '🟠' },
    { name: 'Lavanda', value: 'lavanda', hex: '#E6E6FA', icon: '🟣' },
    { name: 'Menta', value: 'menta', hex: '#98FF98', icon: '🟢' },
    { name: 'Melocotón', value: 'melocotón', hex: '#FFDAB9', icon: '🟠' },
    { name: 'Granate', value: 'granate', hex: '#800020', icon: '🔴' },
    { name: 'Burgundy', value: 'burgundy', hex: '#800020', icon: '🔴' },
    { name: 'Navy', value: 'navy', hex: '#000080', icon: '🔵' },
    { name: 'Oliva', value: 'oliva', hex: '#808000', icon: '🟢' },
    { name: 'Teal', value: 'teal', hex: '#008080', icon: '🔵' },
    { name: 'Púrpura', value: 'púrpura', hex: '#800080', icon: '🟣' },
    { name: 'Magenta', value: 'magenta', hex: '#FF00FF', icon: '🟣' },
    { name: 'Cian', value: 'cian', hex: '#00FFFF', icon: '🔵' },
    { name: 'Lima', value: 'lima', hex: '#00FF00', icon: '🟢' },
    { name: 'Fucsia', value: 'fucsia', hex: '#FF00FF', icon: '🟣' },
    { name: 'Amarillo Limón', value: 'amarillo limón', hex: '#FFFACD', icon: '🟡' },
    { name: 'Verde Manzana', value: 'verde manzana', hex: '#8DB600', icon: '🟢' },
    { name: 'Azul Real', value: 'azul real', hex: '#4169E1', icon: '🔵' },
    { name: 'Rojo Carmesí', value: 'rojo carmesí', hex: '#DC143C', icon: '🔴' },
    { name: 'Verde Esmeralda', value: 'verde esmeralda', hex: '#50C878', icon: '🟢' },
    { name: 'Azul Turquesa', value: 'azul turquesa', hex: '#00CED1', icon: '🔵' },
    { name: 'Rosa Melocotón', value: 'rosa melocotón', hex: '#FFDAB9', icon: '🩷' },
    { name: 'Gris Perla', value: 'gris perla', hex: '#C0C0C0', icon: '🔘' },
    { name: 'Negro Mate', value: 'negro mate', hex: '#2F2F2F', icon: '⚫' },
    { name: 'Blanco Hueso', value: 'blanco hueso', hex: '#F5F5DC', icon: '⚪' },
  ];

  const brands = [
    'Toyota', 'Nissan', 'Honda', 'Mazda', 'Mitsubishi', 'Subaru',
    'Ford', 'Chevrolet', 'Dodge', 'Jeep', 'Chrysler',
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Volvo',
    'Hyundai', 'Kia', 'Suzuki', 'Daihatsu', 'Lexus',
    'Acura', 'Infiniti', 'Buick', 'Cadillac', 'Lincoln',
    'Fiat', 'Alfa Romeo', 'Peugeot', 'Renault', 'Citroën',
    'Seat', 'Skoda', 'Opel', 'Saab', 'Jaguar',
    'Land Rover', 'Mini', 'Smart', 'Tesla', 'Porsche',
    'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce',
    'Aston Martin', 'McLaren', 'Bugatti', 'Koenigsegg', 'Pagani'
  ];

  const brandModels = {
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Prius', 'Yaris', 'Avalon', 'Sienna', '4Runner', 'Sequoia', 'Land Cruiser', 'C-HR', 'Venza', 'Crown'],
    'Nissan': ['Sentra', 'Altima', 'Maxima', 'Versa', 'Rogue', 'Murano', 'Pathfinder', 'Armada', 'Frontier', 'Titan', 'Leaf', 'Ariya', 'Kicks', 'Juke', 'X-Trail', 'Qashqai'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Passport', 'Ridgeline', 'Insight', 'Clarity', 'Fit', 'Odyssey', 'CR-Z', 'S2000', 'NSX', 'Element', 'Crosstour'],
    'Mazda': ['Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-9', 'MX-5', 'MX-30', 'RX-8', 'RX-7', 'Protege', '626', '929', 'MPV', 'B-Series', 'Tribute'],
    'Mitsubishi': ['Mirage', 'Lancer', 'Outlander', 'Eclipse Cross', 'ASX', 'Pajero', 'Montero', 'Galant', 'Eclipse', '3000GT', 'Diamante', 'Sigma', 'Colt', 'Carisma', 'Space Star', 'Attrage'],
    'Ford': ['Focus', 'Fiesta', 'Mondeo', 'Mustang', 'Escape', 'Explorer', 'Expedition', 'F-150', 'Ranger', 'Bronco', 'Edge', 'Flex', 'Taurus', 'Fusion', 'C-Max', 'Transit'],
    'Chevrolet': ['Cruze', 'Malibu', 'Impala', 'Camaro', 'Corvette', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Silverado', 'Colorado', 'Blazer', 'Trax', 'Spark', 'Sonic', 'Aveo'],
    'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4'],
    'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'AMG GT', 'SL', 'SLK'],
    'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q4', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron'],
    'Volkswagen': ['Golf', 'Jetta', 'Passat', 'Arteon', 'Tiguan', 'Atlas', 'ID.3', 'ID.4', 'ID.5', 'Polo', 'Virtus', 'Taigo', 'T-Cross', 'T-Roc', 'Touareg', 'Phaeton'],
    'Hyundai': ['Accent', 'Elantra', 'Sonata', 'Veloster', 'Tucson', 'Santa Fe', 'Palisade', 'Venue', 'Kona', 'Ioniq', 'Nexo', 'Genesis', 'Equus', 'Azera', 'Tiburon', 'Scoupe'],
    'Kia': ['Rio', 'Forte', 'K5', 'Stinger', 'Soul', 'Sportage', 'Sorento', 'Telluride', 'Niro', 'EV6', 'Ceed', 'ProCeed', 'Venga', 'Picanto', 'Pride', 'Besta']
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFoto(files[0]);
      setFotoPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (name === 'placa') {
      // Formatear placa automáticamente
      const formattedPlaca = formatPlaca(value);
      setFormData(prevState => ({
        ...prevState,
        [name]: formattedPlaca
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const formatPlaca = (value) => {
    // Remover todos los caracteres no alfanuméricos
    let cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
    
    // Convertir a mayúsculas
    cleaned = cleaned.toUpperCase();
    
    // Limitar a 6 caracteres (3 letras + 3 números)
    cleaned = cleaned.slice(0, 6);
    
    // Si tiene 6 caracteres, agregar el guión en el medio
    if (cleaned.length === 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    
    return cleaned;
  };

  const handleColorSelect = (color) => {
    setFormData(prevState => ({
      ...prevState,
      color: color.value
    }));
    setShowColorPicker(false);
  };

  const handleBrandSelect = (brand) => {
    setFormData(prevState => ({
      ...prevState,
      marca: brand,
      modelo: '' // Reset modelo when brand changes
    }));
    setShowBrandPicker(false);
  };

  const handleModelSelect = (model) => {
    setFormData(prevState => ({
      ...prevState,
      modelo: model
    }));
    setShowModelPicker(false);
  };

  const handleCustomBrand = () => {
    if (customBrand.trim()) {
      setFormData(prevState => ({
        ...prevState,
        marca: customBrand.trim()
      }));
      setCustomBrand('');
      setShowBrandPicker(false);
    }
  };

  const handleCustomModel = () => {
    if (customModel.trim()) {
      setFormData(prevState => ({
        ...prevState,
        modelo: customModel.trim()
      }));
      setCustomModel('');
      setShowModelPicker(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('empresa', companyId);
      data.append('precio', parseFloat(formData.precio));
      if (foto) data.append('foto', foto);
      await api.post('/api/carros/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/companies/${companyId}/cars`);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data;
        let errorMessage = '';
        for (const key in errors) {
          errorMessage += `${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}\n`;
        }
        setError(errorMessage);
      } else {
        setError('No se pudo agregar el carro. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedColor = colors.find(c => c.value === formData.color);
  const availableModels = brandModels[formData.marca] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-red-200/50"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mr-3 p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
              >
                <Car size={28} className="text-white" />
              </motion.div>
              Agregar Nuevo Carro
            </h2>
            <Link
              to={`/companies/${companyId}/cars`}
              className="text-red-600 hover:text-red-800 transition duration-200 flex items-center"
            >
              <ArrowLeft size={20} className="mr-1" />
              Volver
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Placa */}
              <InputField
                label="Placa"
                name="placa"
                type="text"
                placeholder="ABC123 (se formatea automáticamente)"
                value={formData.placa}
                onChange={handleChange}
                required
                icon={<Tag className="text-red-400" size={18} />}
              />

              {/* Marca con selector */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Marca
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowBrandPicker(!showBrandPicker)}
                    className="w-full flex items-center justify-between p-3 border border-red-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <Car className="text-red-400 mr-3" size={18} />
                      <span className={formData.marca ? 'text-gray-700' : 'text-gray-500'}>
                        {formData.marca || 'Seleccionar marca'}
                      </span>
                    </div>
                    {showBrandPicker ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  <AnimatePresence>
                    {showBrandPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-red-200 max-h-60 overflow-y-auto"
                      >
                        <div className="p-2">
                          {brands.map((brand) => (
                            <button
                              key={brand}
                              type="button"
                              onClick={() => handleBrandSelect(brand)}
                              className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between"
                            >
                              <span>{brand}</span>
                              {formData.marca === brand && <Check className="text-red-600" size={16} />}
                            </button>
                          ))}
                          
                          {/* Opción personalizada */}
                          <div className="border-t border-gray-200 mt-2 pt-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Otra marca..."
                                value={customBrand}
                                onChange={(e) => setCustomBrand(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleCustomBrand()}
                              />
                              <button
                                type="button"
                                onClick={handleCustomBrand}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Modelo con selector */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Modelo
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowModelPicker(!showModelPicker)}
                    disabled={!formData.marca}
                    className="w-full flex items-center justify-between p-3 border border-red-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <Car className="text-red-400 mr-3" size={18} />
                      <span className={formData.modelo ? 'text-gray-700' : 'text-gray-500'}>
                        {formData.modelo || (formData.marca ? 'Seleccionar modelo' : 'Selecciona marca primero')}
                      </span>
                    </div>
                    {showModelPicker ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  <AnimatePresence>
                    {showModelPicker && formData.marca && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-red-200 max-h-60 overflow-y-auto"
                      >
                        <div className="p-2">
                          {availableModels.map((model) => (
                            <button
                              key={model}
                              type="button"
                              onClick={() => handleModelSelect(model)}
                              className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between"
                            >
                              <span>{model}</span>
                              {formData.modelo === model && <Check className="text-red-600" size={16} />}
                            </button>
                          ))}
                          
                          {/* Opción personalizada */}
                          <div className="border-t border-gray-200 mt-2 pt-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Otro modelo..."
                                value={customModel}
                                onChange={(e) => setCustomModel(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleCustomModel()}
                              />
                              <button
                                type="button"
                                onClick={handleCustomModel}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Color con selector */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Color
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full flex items-center justify-between p-3 border border-red-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      {selectedColor ? (
                        <div className="w-6 h-6 rounded-full mr-3 border-2 border-gray-300" style={{ backgroundColor: selectedColor.hex }}></div>
                      ) : (
                        <Palette className="text-red-400 mr-3" size={18} />
                      )}
                      <span className={formData.color ? 'text-gray-700' : 'text-gray-500'}>
                        {selectedColor ? selectedColor.name : 'Seleccionar color'}
                      </span>
                    </div>
                    {showColorPicker ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  <AnimatePresence>
                    {showColorPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-red-200"
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                            {colors.map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => handleColorSelect(color)}
                                className="flex items-center p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <div className="w-5 h-5 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: color.hex }}></div>
                                <span className="text-xs">{color.name}</span>
                                {formData.color === color.value && <Check className="text-red-600 ml-auto" size={14} />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Teléfono */}
              <InputField
                label="Número de Teléfono"
                name="numero_telefono"
                type="tel"
                placeholder="+51 999 999 999"
                value={formData.numero_telefono}
                onChange={handleChange}
                required
                icon={<Phone className="text-red-400" size={18} />}
              />

              {/* Precio */}
              <InputField
                label="Precio (S/)"
                name="precio"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.precio}
                onChange={handleChange}
                required
                icon={<Tag className="text-red-400" size={18} />}
              />

              {/* Fecha */}
              <InputField
                label="Fecha de Llegada"
                name="dia_llegada"
                type="date"
                value={formData.dia_llegada}
                onChange={handleChange}
                disabled
                icon={<Calendar className="text-red-400" size={18} />}
              />

              {/* Foto */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="foto">
                  <Camera className="inline mr-2 text-red-400" size={18} />
                  Foto del Carro
                </label>
                <input
                  className="block w-full text-sm text-gray-700 border border-red-200 rounded-xl cursor-pointer bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  id="foto"
                  name="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
                {fotoPreview && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={fotoPreview}
                    alt="Vista previa"
                    className="mt-2 rounded-xl shadow-lg max-h-40 object-contain border border-red-200"
                  />
                )}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
              >
                <AlertCircle size={18} className="mr-2" />
                <span className="whitespace-pre-line">{error}</span>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out flex items-center justify-center shadow-lg hover:shadow-xl"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Plus size={20} className="mr-2" />
                )}
                {isLoading ? 'Agregando...' : 'Agregar Carro'}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, name, type, placeholder, value, onChange, required, disabled, step, icon }) => (
  <div>
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        className={`shadow appearance-none border border-red-200 rounded-xl w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ease-in-out bg-white/50 backdrop-blur-sm ${icon ? 'pl-10' : ''}`}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        step={step}
      />
    </div>
  </div>
);

export default AddCar;

