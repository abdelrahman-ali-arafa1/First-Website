import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TeamProvider } from './context/TeamContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Gallery = lazy(() => import('./pages/Gallery'));
const UploadDesign = lazy(() => import('./pages/UploadDesign'));
const DesignDetails = lazy(() => import('./pages/DesignDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Team pages
const Teams = lazy(() => import('./pages/Teams'));
const CreateTeam = lazy(() => import('./pages/CreateTeam'));
const TeamDetails = lazy(() => import('./pages/TeamDetails'));

// Portfolio pages
const PortfolioCustomize = lazy(() => import('./pages/PortfolioCustomize'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TeamProvider>
          <PortfolioProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="upload" element={<UploadDesign />} />
                  <Route path="design/:id" element={<DesignDetails />} />
                  
                  {/* Profile routes */}
                  <Route path="profile/:userId" element={<Profile />} />
                  <Route path="profile/customize" element={<PortfolioCustomize />} />
                  
                  {/* Team routes */}
                  <Route path="teams">
                    <Route index element={<Teams />} />
                    <Route path="create" element={<CreateTeam />} />
                    <Route path=":teamId" element={<TeamDetails />} />
                    <Route path=":teamId/projects/new" element={<UploadDesign />} />
                  </Route>
                  
                  <Route path="404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </PortfolioProvider>
        </TeamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 