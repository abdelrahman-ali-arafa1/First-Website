import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const PortfolioContext = createContext(null);

export function usePortfolio() {
  return useContext(PortfolioContext);
}

const STORAGE_KEY = 'studentDesign_portfolioSettings';

// Default theme options
export const PORTFOLIO_THEMES = [
  { id: 'minimal', name: 'Minimal', primaryColor: '#4f46e5', secondaryColor: '#ffffff' },
  { id: 'dark', name: 'Dark Mode', primaryColor: '#1f2937', secondaryColor: '#374151' },
  { id: 'colorful', name: 'Colorful', primaryColor: '#ea580c', secondaryColor: '#fbbf24' },
  { id: 'elegant', name: 'Elegant', primaryColor: '#9333ea', secondaryColor: '#c084fc' },
  { id: 'professional', name: 'Professional', primaryColor: '#0891b2', secondaryColor: '#38bdf8' }
];

// Default layout options
export const PORTFOLIO_LAYOUTS = [
  { id: 'grid', name: 'Grid' },
  { id: 'masonry', name: 'Masonry' },
  { id: 'carousel', name: 'Carousel' },
  { id: 'list', name: 'List View' }
];

export function PortfolioProvider({ children }) {
  const [portfolioSettings, setPortfolioSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load portfolio settings from localStorage on component mount
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem(`${STORAGE_KEY}_${currentUser.id}`);
        if (storedSettings) {
          setPortfolioSettings(JSON.parse(storedSettings));
        } else {
          // Set default settings if none exist
          setPortfolioSettings({
            theme: 'minimal',
            layout: 'grid',
            customColors: null,
            showBio: true,
            showStats: true,
            featuredProjects: [],
            sections: ['projects', 'about', 'skills', 'contact']
          });
        }
      } catch (error) {
        console.error('Failed to load portfolio settings', error);
        // Fallback to defaults
        setPortfolioSettings({
          theme: 'minimal',
          layout: 'grid',
          customColors: null,
          showBio: true,
          showStats: true,
          featuredProjects: [],
          sections: ['projects', 'about', 'skills', 'contact']
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [currentUser]);

  // Save settings whenever they change
  useEffect(() => {
    if (!currentUser || loading) return;

    localStorage.setItem(
      `${STORAGE_KEY}_${currentUser.id}`,
      JSON.stringify(portfolioSettings)
    );
  }, [portfolioSettings, currentUser, loading]);

  // Get user's portfolio settings
  const getUserPortfolioSettings = useCallback((userId) => {
    if (!userId) return null;
    
    try {
      const userSettings = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (userSettings) {
        return JSON.parse(userSettings);
      }
    } catch (error) {
      console.error('Failed to get user portfolio settings', error);
    }
    
    // Return default settings if none exist
    return {
      theme: 'minimal',
      layout: 'grid',
      customColors: null,
      showBio: true,
      showStats: true,
      featuredProjects: [],
      sections: ['projects', 'about', 'skills', 'contact']
    };
  }, []);

  // Update theme
  const updateTheme = useCallback((themeId) => {
    if (!currentUser) return;
    
    setPortfolioSettings(prevSettings => ({
      ...prevSettings,
      theme: themeId,
      // Reset custom colors when changing theme
      customColors: null
    }));
  }, [currentUser]);

  // Update layout
  const updateLayout = useCallback((layoutId) => {
    if (!currentUser) return;
    
    setPortfolioSettings(prevSettings => ({
      ...prevSettings,
      layout: layoutId
    }));
  }, [currentUser]);

  // Set custom colors
  const setCustomColors = useCallback((primaryColor, secondaryColor) => {
    if (!currentUser) return;
    
    setPortfolioSettings(prevSettings => ({
      ...prevSettings,
      customColors: { primary: primaryColor, secondary: secondaryColor }
    }));
  }, [currentUser]);

  // Toggle section visibility
  const toggleSection = useCallback((sectionId, isVisible) => {
    if (!currentUser) return;
    
    setPortfolioSettings(prevSettings => {
      const currentSections = prevSettings.sections || [];
      let updatedSections;
      
      if (isVisible && !currentSections.includes(sectionId)) {
        updatedSections = [...currentSections, sectionId];
      } else if (!isVisible && currentSections.includes(sectionId)) {
        updatedSections = currentSections.filter(section => section !== sectionId);
      } else {
        updatedSections = currentSections;
      }
      
      return {
        ...prevSettings,
        sections: updatedSections
      };
    });
  }, [currentUser]);

  // Set featured projects
  const setFeaturedProjects = useCallback((projectIds) => {
    if (!currentUser) return;
    
    setPortfolioSettings(prevSettings => ({
      ...prevSettings,
      featuredProjects: projectIds
    }));
  }, [currentUser]);

  // Reset portfolio settings to defaults
  const resetSettings = useCallback(() => {
    if (!currentUser) return;
    
    setPortfolioSettings({
      theme: 'minimal',
      layout: 'grid',
      customColors: null,
      showBio: true,
      showStats: true,
      featuredProjects: [],
      sections: ['projects', 'about', 'skills', 'contact']
    });
  }, [currentUser]);

  const value = {
    portfolioSettings,
    loading,
    getUserPortfolioSettings,
    updateTheme,
    updateLayout,
    setCustomColors,
    toggleSection,
    setFeaturedProjects,
    resetSettings
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
} 