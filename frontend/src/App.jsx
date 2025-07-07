import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isAdmin } from './utils/auth';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const CompanyList = lazy(() => import('./components/CompanyList'));
const AddCompany = lazy(() => import('./components/AddCompany'));
const EditCompany = lazy(() => import('./components/EditCompany'));
const CarList = lazy(() => import('./components/CarList'));
const AddCar = lazy(() => import('./components/AddCar'));
const EditCar = lazy(() => import('./components/EditCar'));
const CarDetail = lazy(() => import('./components/CarDetail'));
const PlanList = lazy(() => import('./components/PlanList'));
const PaymentPage = lazy(() => import('./components/PaymentPage'));
const SubscriptionConfirmation = lazy(() => import('./components/SubscriptionConfirmation'));
const CreateCustomerForm = lazy(() => import('./components/CreateCustomerForm'));
const HomePage = lazy(() => import('./components/HomePage'));
const CustomerInfo = lazy(() => import('./components/CustomerInfo'));
const UpdateCustomerForm = lazy(() => import('./components/UpdateCustomerForm'));
const CheckoutComponent = lazy(() => import('./components/CheckoutComponent'));
const SubscriptionList = lazy(() => import('./components/SubscriptionList'));
const ReclamoForm = lazy(() => import('./components/ReclamoForm'));
const ReclamosList = lazy(() => import('./components/ReclamosList'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminUsersList = lazy(() => import('./components/AdminUsersList'));
const AdminReclamosList = lazy(() => import('./components/AdminReclamosList'));
const AuthRedirect = lazy(() => import('./components/AuthRedirect'));

// Componente de partículas flotantes
const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gradient-to-r from-red-400/60 to-red-600/60 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: 0,
        }}
        animate={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 15 + 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

// Componente interno que tiene acceso al contexto de autenticación
const AppContent = () => {
  const { user } = useAuth();
  const isUserAdmin = user && isAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-red-50 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Efectos de fondo */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Renderizar navbar condicional basado en el rol del usuario */}
      <div className="relative z-[100]">
        {isUserAdmin ? <AdminNavbar /> : <Navbar />}
      </div>
      
      <main className="flex-grow relative z-10">
        <Suspense fallback={
          <div className="flex justify-center items-center h-screen">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
            />
          </div>
        }>
          <Routes>
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/createCustomerForm" element={<CreateCustomerForm />} />
            <Route path="/plans" element={<PlanList />} />
            <Route path="/subconfirmation" element={<SubscriptionConfirmation />} />
            <Route path="/add-company" element={<AddCompany />} />
            <Route path="/edit-company/:id" element={<EditCompany />} />
            <Route path="/companies/:companyId/cars" element={<CarList />} />
            <Route path="/companies/:companyId/add-car" element={<AddCar />} />
            <Route path="/companies/:companyId/edit-car/:carId" element={<EditCar />} />
            <Route path="/companies/:companyId/car/:carId" element={<CarDetail />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/profile" element={<CustomerInfo />} />
            <Route path="/update-customer" element={<UpdateCustomerForm />} />
            <Route path="/card" element={<CheckoutComponent />} />
            <Route path="/suscripciones" element={<SubscriptionList />} />
            <Route path="/reclamo" element={<ReclamoForm />} />
            <Route path="/mis-reclamos" element={<ReclamosList />} />
            
            {/* Rutas protegidas de administrador */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/usuarios" element={
              <AdminRoute>
                <AdminUsersList />
              </AdminRoute>
            } />
            <Route path="/admin/reclamos" element={
              <AdminRoute>
                <AdminReclamosList />
              </AdminRoute>
            } />
          </Routes>
        </Suspense>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

