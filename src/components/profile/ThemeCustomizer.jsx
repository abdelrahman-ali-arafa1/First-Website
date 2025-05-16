import { useState, useEffect } from 'react';
import { usePortfolio, PORTFOLIO_THEMES, PORTFOLIO_LAYOUTS } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';

export default function ThemeCustomizer() {
  const { currentUser } = useAuth();
  const { 
    portfolioSettings, 
    updateTheme, 
    updateLayout, 
    setCustomColors,
    resetSettings,
    loading 
  } = usePortfolio();
  
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('themes');
  const [previewStyle, setPreviewStyle] = useState({});

  // Update color picker values when theme changes
  useEffect(() => {
    if (loading) return;
    
    const currentTheme = portfolioSettings.theme || 'minimal';
    const customColors = portfolioSettings.customColors;
    
    if (customColors) {
      setPrimaryColor(customColors.primary);
      setSecondaryColor(customColors.secondary);
    } else {
      const themeColors = PORTFOLIO_THEMES.find(theme => theme.id === currentTheme);
      if (themeColors) {
        setPrimaryColor(themeColors.primaryColor);
        setSecondaryColor(themeColors.secondaryColor);
      }
    }
  }, [portfolioSettings, loading]);

  // Update preview style when colors change
  useEffect(() => {
    setPreviewStyle({
      backgroundColor: secondaryColor,
      color: getContrastColor(secondaryColor),
      borderColor: primaryColor,
      '--accent-color': primaryColor
    });
  }, [primaryColor, secondaryColor]);

  if (!currentUser) {
    return (
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
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
      </div>
    );
  }

  // Helper function to determine text color based on background
  function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on background luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  // Handle applying custom colors
  const handleApplyCustomColors = () => {
    setCustomColors(primaryColor, secondaryColor);
    setShowColorPicker(false);
  };

  // Handle theme selection
  const handleThemeSelect = (themeId) => {
    updateTheme(themeId);
  };

  // Handle layout selection
  const handleLayoutSelect = (layoutId) => {
    updateLayout(layoutId);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Portfolio Customization
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Customize how your portfolio looks to visitors.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('themes')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'themes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Themes
          </button>
          <button
            onClick={() => setActiveTab('layouts')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'layouts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Layouts
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'colors'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Colors
          </button>
        </nav>
      </div>
      
      <div className="p-4">
        {/* Theme Selection Tab */}
        {activeTab === 'themes' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Theme
              </label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {PORTFOLIO_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`relative rounded-lg p-2 bg-white border-2 ${
                      portfolioSettings.theme === theme.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
                    } transition-all hover:shadow-md focus:outline-none`}
                  >
                    <div 
                      className="w-full aspect-video rounded mb-2" 
                      style={{ 
                        backgroundColor: theme.secondaryColor,
                        border: `4px solid ${theme.primaryColor}`
                      }}
                    ></div>
                    <p className="text-xs font-medium text-center">{theme.name}</p>
                    {portfolioSettings.theme === theme.id && (
                      <span className="absolute top-1 right-1 text-indigo-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Layout Selection Tab */}
        {activeTab === 'layouts' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Layout
              </label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {PORTFOLIO_LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => handleLayoutSelect(layout.id)}
                    className={`relative rounded-lg p-2 bg-white border-2 ${
                      portfolioSettings.layout === layout.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
                    } transition-all hover:shadow-md focus:outline-none`}
                  >
                    <div className="w-full aspect-video rounded mb-2 flex justify-center items-center bg-gray-100">
                      {layout.id === 'grid' && (
                        <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-300 rounded"></div>
                          ))}
                        </div>
                      )}
                      {layout.id === 'masonry' && (
                        <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                          <div className="bg-gray-300 rounded h-2/3"></div>
                          <div className="bg-gray-300 rounded h-full"></div>
                          <div className="bg-gray-300 rounded h-full"></div>
                          <div className="bg-gray-300 rounded h-1/2"></div>
                        </div>
                      )}
                      {layout.id === 'carousel' && (
                        <div className="flex space-x-1 w-full h-full p-1 overflow-hidden">
                          <div className="bg-gray-300 rounded w-3/4 h-full flex-shrink-0"></div>
                          <div className="bg-gray-400 rounded w-3/4 h-full flex-shrink-0"></div>
                        </div>
                      )}
                      {layout.id === 'list' && (
                        <div className="flex flex-col space-y-1 w-full h-full p-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-300 rounded h-1/4 flex">
                              <div className="w-1/4 bg-gray-400 rounded-l"></div>
                              <div className="w-3/4"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-center">{layout.name}</p>
                    {portfolioSettings.layout === layout.id && (
                      <span className="absolute top-1 right-1 text-indigo-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Custom Colors Tab */}
        {activeTab === 'colors' && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Colors
                </label>
                
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {showColorPicker ? 'Hide Color Picker' : 'Show Color Picker'}
                </button>
              </div>
              
              {/* Color Preview */}
              <div className="mb-4">
                <div 
                  className="w-full p-4 rounded-lg border-4 mb-2"
                  style={previewStyle}
                >
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-10 h-10 rounded-full mr-3"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    <div>
                      <h4 className="font-bold text-sm">Primary Color</h4>
                      <p className="text-xs opacity-80">{primaryColor}</p>
                    </div>
                  </div>
                  
                  <div 
                    className="w-full h-12 rounded-lg flex items-center justify-center font-bold"
                    style={{ backgroundColor: primaryColor, color: getContrastColor(primaryColor) }}
                  >
                    Primary Button
                  </div>
                  
                  <div className="my-2 text-sm">
                    This is how your text will look on the background.
                  </div>
                  
                  <div 
                    className="w-full h-1 my-3"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  
                  <div className="flex justify-between text-xs opacity-80">
                    <span>Sample Text</span>
                    <span style={{ color: primaryColor }}>Accent Text</span>
                  </div>
                </div>
              </div>
              
              {showColorPicker && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex">
                        <div 
                          className="w-8 h-8 rounded-l border border-r-0 border-gray-300"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="rounded-r border border-gray-300 px-3 py-1 flex-1"
                        />
                      </div>
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="mt-2 w-full h-10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Color
                      </label>
                      <div className="flex">
                        <div 
                          className="w-8 h-8 rounded-l border border-r-0 border-gray-300"
                          style={{ backgroundColor: secondaryColor }}
                        ></div>
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="rounded-r border border-gray-300 px-3 py-1 flex-1"
                        />
                      </div>
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="mt-2 w-full h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleApplyCustomColors}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply Colors
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={resetSettings}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 