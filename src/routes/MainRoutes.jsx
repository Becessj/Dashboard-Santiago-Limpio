import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

// Custom hook to check if user is authenticated
const useAuth = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

// Protected route wrapper
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Pages
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const RutasGPS = Loadable(lazy(() => import('pages/rutas-gps/rutas-gps')));
const Noticias = Loadable(lazy(() => import('pages/noticias/noticias')));
const Notificaciones = Loadable(lazy(() => import('pages/notificaciones/notificaciones')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: useAuth() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
    },
    {
      path: '/dashboard',
      element: <ProtectedRoute element={<DashboardDefault />} />
    },
    {
      path: 'color',
      element: <ProtectedRoute element={<Color />} />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard',
          element: <ProtectedRoute element={<DashboardDefault />} />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <ProtectedRoute element={<SamplePage />} />
    },
    {
      path: 'shadow',
      element: <ProtectedRoute element={<Shadow />} />
    },
    {
      path: 'typography',
      element: <ProtectedRoute element={<Typography />} />
    },
    {
      path: 'rutas-gps',
      element: <ProtectedRoute element={<RutasGPS />} />
    },
    {
      path: 'noticias',
      element: <ProtectedRoute element={<Noticias />} />
    },
    {
      path: 'notificaciones',
      element: <ProtectedRoute element={<Notificaciones />} />
    }
  ]
};

export default MainRoutes;
