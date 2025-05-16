import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';
import { DESIGN_CATEGORIES } from '../context/DesignContext';
import Card, { CardMedia, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  RectangleStackIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// View mode constants
const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
  MASONRY: 'masonry'
};

function Gallery() {
  const { designs, loading, searchDesigns } = useDesign();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');
  const [viewMode, setViewMode] = useState(searchParams.get('view') || VIEW_MODES.GRID);
  
  // Handle params from URL on initial load
  useEffect(() => {
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const sort = searchParams.get('sort');
    const view = searchParams.get('view');
    
    if (category) {
      setSelectedCategories(category.split(','));
    }
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (sort) {
      setSortBy(sort);
    }
    
    if (view) {
      setViewMode(view);
    }
  }, [searchParams]);
  
  // Filter and sort designs when dependencies change
  useEffect(() => {
    if (loading) return;
    
    // Apply search and multiple category filters
    let filtered = designs;
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(design => 
        design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filters (if any selected)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(design => selectedCategories.includes(design.category));
    }
    
    // Then sort the results
    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.likes.length - a.likes.length);
        break;
      case 'comments':
        filtered = [...filtered].sort((a, b) => b.comments.length - a.comments.length);
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'recent':
      default:
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredDesigns(filtered);
  }, [designs, loading, selectedCategories, searchQuery, sortBy]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams();
  };
  
  // Update URL search parameters
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('query', searchQuery);
    }
    
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }
    
    if (sortBy !== 'recent') {
      params.set('sort', sortBy);
    }
    
    if (viewMode !== VIEW_MODES.GRID) {
      params.set('view', viewMode);
    }
    
    setSearchParams(params);
  };
  
  // Handle category selection (multi-select)
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      // If category is already selected, remove it
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      // Otherwise add it
      return [...prev, categoryId];
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setSortBy('recent');
    setSearchParams({});
  };
  
  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Set view mode
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    updateSearchParams();
  };
  
  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategories.length > 0) count++;
    if (sortBy !== 'recent') count++;
    return count;
  }, [searchQuery, selectedCategories, sortBy]);

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-16 rounded-xl overflow-hidden">
        {/* Abstract geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 10 + 2}rem`,
                  height: `${Math.random() * 10 + 2}rem`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                  transform: `scale(${Math.random() * 0.8 + 0.6})`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Design Gallery</h1>
          <p className="text-primary-100 max-w-2xl mx-auto text-lg">
            Explore creative projects from student designers around the world. Find inspiration and connect with talented creators.
          </p>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="w-full md:flex-1">
            <form onSubmit={handleSearch} className="flex gap-2 items-center">
              <div className="flex-1">
                <FormInput
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full"
                  containerClassName="mb-0"
                  icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <Button type="submit" className="flex-shrink-0 rounded-full h-11">
                <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
                <span>Search</span>
              </Button>
            </form>
          </div>
          
          {/* View Mode Switcher (Desktop) */}
          <div className="hidden md:flex justify-end space-x-2 border-l border-gray-200 pl-4">
                        <button              onClick={() => handleViewModeChange(VIEW_MODES.GRID)}              className={`h-11 w-11 flex items-center justify-center rounded-full transition-colors ${                viewMode === VIEW_MODES.GRID                   ? 'bg-primary-100 text-primary-700'                   : 'text-gray-500 hover:bg-gray-100'              }`}              title="Grid View"            >              <Squares2X2Icon className="h-5 w-5" />            </button>            <button              onClick={() => handleViewModeChange(VIEW_MODES.LIST)}              className={`h-11 w-11 flex items-center justify-center rounded-full transition-colors ${                viewMode === VIEW_MODES.LIST                   ? 'bg-primary-100 text-primary-700'                   : 'text-gray-500 hover:bg-gray-100'              }`}              title="List View"            >              <ListBulletIcon className="h-5 w-5" />            </button>            <button              onClick={() => handleViewModeChange(VIEW_MODES.MASONRY)}              className={`h-11 w-11 flex items-center justify-center rounded-full transition-colors ${                viewMode === VIEW_MODES.MASONRY                   ? 'bg-primary-100 text-primary-700'                   : 'text-gray-500 hover:bg-gray-100'              }`}              title="Masonry View"            >              <RectangleStackIcon className="h-5 w-5" />            </button>
          </div>
          
          {/* Filter Toggle Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <Button 
              variant={activeFilterCount > 0 ? "primary" : "outline"} 
              onClick={toggleFilters}
              className="rounded-full h-11"
            >
              <FunnelIcon className="h-5 w-5 mr-1" />
              <span>
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-white text-primary-600 rounded-full px-2 py-0.5 text-xs font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </Button>
          </div>
          
          {/* Mobile Filter & View Controls */}
          <div className="md:hidden w-full flex space-x-2 items-center">
            <Button 
              variant={activeFilterCount > 0 ? "primary" : "outline"} 
              onClick={toggleFilters}
              className="flex-1 rounded-full h-11 flex items-center justify-center"
            >
              <FunnelIcon className="h-5 w-5 mr-1" />
              <span>
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-white text-primary-600 rounded-full px-2 py-0.5 text-xs font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </Button>
            
            <div className="flex rounded-full border border-gray-200 overflow-hidden h-11">
              <button
                onClick={() => handleViewModeChange(VIEW_MODES.GRID)}
                className={`flex items-center justify-center h-full aspect-square ${
                  viewMode === VIEW_MODES.GRID 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-500'
                }`}
                title="Grid View"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleViewModeChange(VIEW_MODES.LIST)}
                className={`flex items-center justify-center h-full aspect-square ${
                  viewMode === VIEW_MODES.LIST 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-500'
                }`}
                title="List View"
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleViewModeChange(VIEW_MODES.MASONRY)}
                className={`flex items-center justify-center h-full aspect-square ${
                  viewMode === VIEW_MODES.MASONRY 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-500'
                }`}
                title="Masonry View"
              >
                <RectangleStackIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Filter Panel (Desktop & Mobile) */}
        {showFilters && (
          <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">              <h3 className="font-medium text-gray-900">Filters</h3>              <div className="flex space-x-2">                {activeFilterCount > 0 && (                  <button                    onClick={clearFilters}                    className="h-9 px-3 text-sm rounded-full text-gray-500 hover:text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors"                  >                    <XMarkIcon className="h-4 w-4 mr-1" />                    Clear all                  </button>                )}                <button                  onClick={toggleFilters}                  className="h-9 px-3 text-sm rounded-full text-gray-500 hover:text-gray-700 md:hidden flex items-center justify-center hover:bg-gray-50 transition-colors"                >                  Close                </button>              </div>            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                            <div className="flex flex-wrap gap-2">                {Object.entries(DESIGN_CATEGORIES).map(([id, category]) => (                  <button                    key={id}                    onClick={() => handleCategoryToggle(id)}                    className={`h-9 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${                      selectedCategories.includes(id)                        ? 'bg-primary-100 text-primary-700'                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'                    }`}                  >                    {category.name}                  </button>                ))}              </div>
            </div>
            
            {/* Sort By */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sort by</h4>
                            <div className="flex flex-wrap gap-2">                <button                  onClick={() => setSortBy('recent')}                  className={`h-9 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${                    sortBy === 'recent'                      ? 'bg-primary-100 text-primary-700'                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'                  }`}                >                  Most Recent                </button>                <button                  onClick={() => setSortBy('popular')}                  className={`h-9 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${                    sortBy === 'popular'                      ? 'bg-primary-100 text-primary-700'                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'                  }`}                >                  Most Popular                </button>                <button                  onClick={() => setSortBy('comments')}                  className={`h-9 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${                    sortBy === 'comments'                      ? 'bg-primary-100 text-primary-700'                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'                  }`}                >                  Most Comments                </button>                <button                  onClick={() => setSortBy('oldest')}                  className={`h-9 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${                    sortBy === 'oldest'                      ? 'bg-primary-100 text-primary-700'                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'                  }`}                >                  Oldest First                </button>              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Results */}
      <div>
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
            ) : (
              <>
                {searchQuery || selectedCategories.length > 0 ? (
                  <span>
                    {filteredDesigns.length} {filteredDesigns.length === 1 ? 'result' : 'results'}
                    {searchQuery && <span> for "{searchQuery}"</span>}
                  </span>
                ) : (
                  'All Designs'
                )}
              </>
            )}
          </h2>
          
          <div className="text-sm text-gray-500">
            {!loading && filteredDesigns.length > 0 && (
              <span>{filteredDesigns.length} {filteredDesigns.length === 1 ? 'design' : 'designs'}</span>
            )}
          </div>
        </div>
        
        {/* Results Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl aspect-[4/3] w-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl py-16 px-4 text-center shadow-inner">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No designs found</h3>
              <p className="text-gray-600 mb-8">
                {searchQuery || selectedCategories.length > 0 ? (
                  "We couldn't find any designs matching your search. Try adjusting your filters or search terms."
                ) : (
                  "No designs have been uploaded yet. Be the first to share your work!"
                )}
              </p>
                            {(searchQuery || selectedCategories.length > 0) && (                <Button onClick={clearFilters} className="rounded-full h-11">                  Clear all filters                </Button>              )}
            </div>
          </div>
        ) : (
          <>
            {viewMode === VIEW_MODES.GRID && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDesigns.map((design) => (
                  <Card key={design.id} className="border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
                    <Link to={`/design/${design.id}`}>
                      <CardMedia 
                        src={design.imageUrl} 
                        alt={design.title} 
                        aspectRatio="aspect-[4/3]" 
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <CardContent className="pb-2">
                      <Link to={`/design/${design.id}`}>
                        <h3 className="font-bold text-lg mb-2 hover:text-primary-600 transition-colors">
                          {design.title}
                        </h3>
                      </Link>
                      <Link to={`/profile/${design.userId}`} className="flex items-center mb-3">
                        <img 
                          src={design.userAvatar} 
                          alt={design.userName} 
                          className="w-8 h-8 rounded-full mr-2 border-2 border-white shadow-sm"
                        />
                        <span className="text-sm text-gray-600">{design.userName}</span>
                      </Link>
                      <p className="text-gray-600 line-clamp-2 text-sm mb-3">
                        {design.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-gray-500 text-sm border-t border-gray-100 py-3">
                      <div className="flex items-center">
                        <HeartIcon className="h-5 w-5 mr-1 text-secondary-500" />
                        <span>{design.likes.length}</span>
                      </div>
                      <div className="flex items-center">
                        <ChatBubbleLeftIcon className="h-5 w-5 mr-1 text-primary-500" />
                        <span>{design.comments.length}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            {viewMode === VIEW_MODES.LIST && (
              <div className="space-y-6">
                {filteredDesigns.map((design) => (
                  <div 
                    key={design.id} 
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row"
                  >
                    <Link 
                      to={`/design/${design.id}`}
                      className="md:w-64 lg:w-80 shrink-0"
                    >
                      <div className="aspect-[4/3] md:h-full overflow-hidden">
                        <img 
                          src={design.imageUrl} 
                          alt={design.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <Link to={`/profile/${design.userId}`} className="flex items-center">
                            <img 
                              src={design.userAvatar} 
                              alt={design.userName} 
                              className="w-8 h-8 rounded-full mr-2 border-2 border-white shadow-sm"
                            />
                            <span className="text-sm text-gray-600">{design.userName}</span>
                          </Link>
                          <span className="text-xs text-gray-500">
                            {new Date(design.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link to={`/design/${design.id}`}>
                          <h3 className="text-xl font-bold mb-2 hover:text-primary-600 transition-colors">
                            {design.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 mb-4">
                          {design.description}
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                            {DESIGN_CATEGORIES[design.category]?.name || design.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <HeartIcon className="h-5 w-5 mr-1 text-secondary-500" />
                            <span className="text-gray-600">{design.likes.length}</span>
                          </div>
                          <div className="flex items-center">
                            <ChatBubbleLeftIcon className="h-5 w-5 mr-1 text-primary-500" />
                            <span className="text-gray-600">{design.comments.length}</span>
                          </div>
                        </div>
                        <Link 
                          to={`/design/${design.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {viewMode === VIEW_MODES.MASONRY && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredDesigns.map((design) => (
                  <div 
                    key={design.id} 
                    className="break-inside-avoid bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <Link to={`/design/${design.id}`}>
                      <img 
                        src={design.imageUrl} 
                        alt={design.title}
                        className="w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="p-5">
                      <Link to={`/design/${design.id}`}>
                        <h3 className="font-bold text-lg mb-2 hover:text-primary-600 transition-colors">
                          {design.title}
                        </h3>
                      </Link>
                      <Link to={`/profile/${design.userId}`} className="flex items-center mb-3">
                        <img 
                          src={design.userAvatar} 
                          alt={design.userName} 
                          className="w-8 h-8 rounded-full mr-2 border-2 border-white shadow-sm"
                        />
                        <span className="text-sm text-gray-600">{design.userName}</span>
                      </Link>
                      <p className="text-gray-600 line-clamp-3 text-sm mb-3">
                        {design.description}
                      </p>
                      <div className="flex justify-between text-gray-500 text-sm border-t border-gray-100 pt-3">
                        <div className="flex items-center">
                          <HeartIcon className="h-5 w-5 mr-1 text-secondary-500" />
                          <span>{design.likes.length}</span>
                        </div>
                        <div className="flex items-center">
                          <ChatBubbleLeftIcon className="h-5 w-5 mr-1 text-primary-500" />
                          <span>{design.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Gallery; 