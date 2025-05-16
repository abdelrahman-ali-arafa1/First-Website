import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio, PORTFOLIO_THEMES } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';

export default function PortfolioLayout({ userId, designs = [], userProfile }) {
  const { getUserPortfolioSettings } = usePortfolio();
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user portfolio settings
  useEffect(() => {
    if (!userId) return;
    
    const userSettings = getUserPortfolioSettings(userId);
    setSettings(userSettings);
    setLoading(false);
  }, [userId, getUserPortfolioSettings]);

  if (loading || !settings) {
    return (
      <div className="animate-pulse">
        <div className="h-40 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Get theme colors
  const getThemeColors = () => {
    if (settings.customColors) {
      return {
        primary: settings.customColors.primary,
        secondary: settings.customColors.secondary
      };
    }
    
    const theme = PORTFOLIO_THEMES.find(t => t.id === settings.theme) || PORTFOLIO_THEMES[0];
    return {
      primary: theme.primaryColor,
      secondary: theme.secondaryColor
    };
  };

  const colors = getThemeColors();
  
  // Helper to get contrasting text color
  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  // Base styles using theme colors
  const themeStyles = {
    background: colors.secondary,
    color: getContrastColor(colors.secondary),
    accent: colors.primary,
    accentText: getContrastColor(colors.primary)
  };

  // Featured projects
  const featuredProjectIds = settings.featuredProjects || [];
  const featuredDesigns = designs.filter(design => 
    featuredProjectIds.includes(design.id)
  );
  
  // Other projects 
  const otherDesigns = designs.filter(design => 
    !featuredProjectIds.includes(design.id)
  );
  
  // All projects to display
  const displayDesigns = [...featuredDesigns, ...otherDesigns];

  return (
    <div 
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: themeStyles.background, color: themeStyles.color }}
    >
      {/* Header Section */}
      <div className="p-6 mb-6" style={{ borderBottom: `4px solid ${themeStyles.accent}` }}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 flex-shrink-0"
            style={{ borderColor: themeStyles.accent }}
          >
            <img 
              src={userProfile?.avatar || 'https://via.placeholder.com/128'} 
              alt={userProfile?.name || 'User'} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{userProfile?.name || 'User Name'}</h1>
            
            {/* Bio */}
            {settings.showBio && userProfile?.bio && (
              <p className="mb-4 max-w-2xl">{userProfile.bio}</p>
            )}
            
            {/* Stats */}
            {settings.showStats && (
              <div 
                className="inline-flex items-center space-x-4 px-4 py-2 rounded-full text-sm"
                style={{ backgroundColor: themeStyles.accent, color: themeStyles.accentText }}
              >
                <div>
                  <span className="font-bold">{designs.length}</span> Projects
                </div>
                <div>
                  <span className="font-bold">{designs.reduce((sum, design) => sum + design.likes.length, 0)}</span> Likes
                </div>
                <div>
                  <span className="font-bold">{designs.reduce((sum, design) => sum + design.comments.length, 0)}</span> Comments
                </div>
              </div>
            )}
            
            {/* Edit Profile Button (Only visible to the profile owner) */}
            {currentUser && currentUser.id === userId && (
              <div className="mt-4">
                <Link 
                  to="/profile/customize"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium"
                  style={{ backgroundColor: themeStyles.accent, color: themeStyles.accentText }}
                >
                  Customize Portfolio
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Project Display Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: themeStyles.accent }}>
          My Projects
        </h2>
        
        {/* Grid Layout */}
        {settings.layout === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDesigns.map((design) => (
              <ProjectCard 
                key={design.id} 
                design={design} 
                themeStyles={themeStyles}
                isFeatured={featuredProjectIds.includes(design.id)}
              />
            ))}
          </div>
        )}
        
        {/* Masonry Layout */}
        {settings.layout === 'masonry' && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {displayDesigns.map((design) => (
              <div key={design.id} className="break-inside-avoid">
                <ProjectCard 
                  design={design} 
                  themeStyles={themeStyles}
                  isFeatured={featuredProjectIds.includes(design.id)}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Carousel Layout */}
        {settings.layout === 'carousel' && (
          <div className="relative overflow-x-auto pb-6">
            <div className="flex space-x-6">
              {displayDesigns.map((design) => (
                <div key={design.id} className="flex-shrink-0 w-80">
                  <ProjectCard 
                    design={design} 
                    themeStyles={themeStyles}
                    isFeatured={featuredProjectIds.includes(design.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* List Layout */}
        {settings.layout === 'list' && (
          <div className="space-y-6">
            {displayDesigns.map((design) => (
              <div 
                key={design.id} 
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg"
                style={{ backgroundColor: themeStyles.background === colors.secondary 
                  ? `${colors.secondary}22` // Add slight transparency
                  : colors.secondary
                }}
              >
                <div className="sm:w-1/3 h-48 rounded-lg overflow-hidden">
                  <img 
                    src={design.imageUrl} 
                    alt={design.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold">
                      {design.title}
                      {featuredProjectIds.includes(design.id) && (
                        <span 
                          className="ml-2 inline-block px-2 py-1 text-xs rounded-full"
                          style={{ backgroundColor: themeStyles.accent, color: themeStyles.accentText }}
                        >
                          Featured
                        </span>
                      )}
                    </h3>
                    <span className="text-sm opacity-75">
                      {new Date(design.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3">{design.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <span>{design.likes.length} likes</span>
                      <span>{design.comments.length} comments</span>
                    </div>
                    <Link
                      to={`/design/${design.id}`}
                      className="px-4 py-2 text-sm rounded"
                      style={{ backgroundColor: themeStyles.accent, color: themeStyles.accentText }}
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {displayDesigns.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No projects yet</h3>
            <p className="mt-1 text-sm opacity-75">
              {currentUser?.id === userId
                ? "You haven't uploaded any projects. Start sharing your work!"
                : "This user hasn't uploaded any projects yet."}
            </p>
            {currentUser?.id === userId && (
              <div className="mt-6">
                <Link 
                  to="/upload"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium"
                  style={{ backgroundColor: themeStyles.accent, color: themeStyles.accentText }}
                >
                  Upload Your First Project
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ design, themeStyles, isFeatured }) {
  return (
    <div 
      className="rounded-lg overflow-hidden shadow-md h-full flex flex-col"
      style={{ backgroundColor: `${themeStyles.background}22`, backdropFilter: 'blur(4px)' }}
    >
      {/* Project Image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={design.imageUrl} 
          alt={design.title} 
          className="w-full h-full object-cover"
        />
        {isFeatured && (
          <div 
            className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
            style={{ backgroundColor: themeStyles.accent, color: themeStyles.accentText }}
          >
            Featured
          </div>
        )}
      </div>
      
      {/* Project Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2">{design.title}</h3>
        <p className="text-sm line-clamp-2 flex-1">{design.description}</p>
        
        <div className="mt-4 pt-4 flex items-center justify-between text-sm" style={{ borderTop: `1px solid ${themeStyles.accent}22` }}>
          <div className="flex items-center space-x-4">
            <span>{design.likes.length} likes</span>
            <span>{design.comments.length} comments</span>
          </div>
          <Link
            to={`/design/${design.id}`}
            className="px-3 py-1 rounded"
            style={{ backgroundColor: themeStyles.accent, color: themeStyles.accentText }}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
} 