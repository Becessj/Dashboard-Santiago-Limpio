import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// Hook para verificar autenticación
const useAuth = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  return token !== null && userType; // Verifica que el token y el tipo de usuario existan
};


// Componente para redirección si está autenticado
const RedirectIfAuthenticated = ({ element }) => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

// render - login/register
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <RedirectIfAuthenticated element={<AuthLogin />} />
    },
    {
      path: '/register',
      element: <RedirectIfAuthenticated element={<AuthRegister />} />
    }
  ]
};

export default LoginRoutes;
