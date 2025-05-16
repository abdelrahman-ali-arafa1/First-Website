import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import ThemeCustomizer from '../components/profile/ThemeCustomizer';
import PortfolioLayout from '../components/profile/PortfolioLayout';
import { useDesign } from '../context/DesignContext';

export default function PortfolioCustomize() {
  const { currentUser, loading: authLoading } = useAuth();
  const { portfolioSettings, loading: portfolioLoading } = usePortfolio();
  const { getDesignsByUser, loading: designsLoading } = useDesign();
  const [userDesigns, setUserDesigns] = useState([]);
  const [activeSection, setActiveSection] = useState('theme');
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, authLoading, navigate]);

  // Load user designs
  useEffect(() => {
    if (!currentUser || designsLoading) return;
    
    const designs = getDesignsByUser(currentUser.id);
    setUserDesigns(designs || []);
  }, [currentUser, getDesignsByUser, designsLoading]);

  // If still loading, show skeleton
  if (authLoading || portfolioLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If not logged in, show message (though redirect should happen)
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be logged in to customize your portfolio.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Customize Your Portfolio</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveSection('theme')}
            className={`pb-4 px-1 ${activeSection === 'theme' ? 
              'border-b-2 border-indigo-500 text-indigo-600' : 
              'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Theme & Layout
          </button>
          <button
            onClick={() => setActiveSection('preview')}
            className={`pb-4 px-1 ${activeSection === 'preview' ? 
              'border-b-2 border-indigo-500 text-indigo-600' : 
              'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Portfolio Preview
          </button>
          <button
            onClick={() => setActiveSection('projects')}
            className={`pb-4 px-1 ${activeSection === 'projects' ? 
              'border-b-2 border-indigo-500 text-indigo-600' : 
              'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Featured Projects
          </button>
        </nav>
      </div>
      
      {/* Theme & Layout Customization */}
      {activeSection === 'theme' && (
        <div>
          <p className="text-gray-700 mb-6">
            Customize the look and feel of your portfolio. Choose a theme, layout, and color scheme that best represents your style.
          </p>
          
          <ThemeCustomizer />
        </div>
      )}
      
      {/* Portfolio Preview */}
      {activeSection === 'preview' && (
        <div>
          <p className="text-gray-700 mb-6">
            This is how your portfolio will look to visitors with your current settings. Switch to the Theme & Layout tab to make changes.
          </p>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <PortfolioLayout 
              userId={currentUser.id}
              designs={userDesigns}
              userProfile={currentUser}
            />
          </div>
        </div>
      )}
      
      {/* Featured Projects Selection */}
      {activeSection === 'projects' && (
        <FeaturedProjectsSelector 
          designs={userDesigns}
        />
      )}
    </div>
  );
}

// Component for selecting featured projects
function FeaturedProjectsSelector({ designs }) {
  const { portfolioSettings, setFeaturedProjects } = usePortfolio();
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  // Initialize selected projects from settings
  useEffect(() => {
    setSelectedProjects(portfolioSettings.featuredProjects || []);
  }, [portfolioSettings]);
  
  // Toggle project selection
  const toggleProjectSelection = (designId) => {
    setSelectedProjects(prev => {
      if (prev.includes(designId)) {
        return prev.filter(id => id !== designId);
      } else {
        return [...prev, designId];
      }
    });
  };
  
  // Save featured projects
  const saveSelection = () => {
    setFeaturedProjects(selectedProjects);
  };
  
  if (designs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Featured Projects
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Highlight your best work by selecting projects to feature at the top of your portfolio.
          </p>
        </div>
        
        <div className="p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You need to upload projects before you can feature them on your portfolio.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Featured Projects
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Highlight your best work by selecting projects to feature at the top of your portfolio.
        </p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {designs.map(design => (
            <div 
              key={design.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedProjects.includes(design.id) 
                  ? 'border-indigo-500 ring-2 ring-indigo-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleProjectSelection(design.id)}
            >
              <div className="h-40 bg-gray-100 relative">
                <img 
                  src={design.imageUrl}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
                {selectedProjects.includes(design.id) && (
                  <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium">{design.title}</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{design.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <p className="text-sm text-gray-500 mr-4 self-center">
            {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={saveSelection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Featured Projects
          </button>
        </div>
      </div>
    </div>
  );
} 