import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const DesignContext = createContext(null);

export function useDesign() {
  return useContext(DesignContext);
}

// Categories for designs
export const DESIGN_CATEGORIES = [
  { id: 'graphic', name: 'Graphic Design' },
  { id: 'ui', name: 'UI/UX Design' },
  { id: 'industrial', name: 'Industrial Design' },
  { id: 'architecture', name: 'Architecture' },
  { id: 'fashion', name: 'Fashion Design' },
  { id: 'interior', name: 'Interior Design' },
  { id: 'photography', name: 'Photography' },
  { id: 'illustration', name: 'Illustration' },
  { id: 'other', name: 'Other' },
];

const STORAGE_KEY = 'studentDesign_designs';
const CACHE_VERSION = 1;
const CACHE_TIMESTAMP_KEY = 'studentDesign_cache_timestamp';

export function DesignProvider({ children }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Initialize from localStorage and handle caching
  useEffect(() => {
    const loadDesigns = () => {
      try {
        // Check for cached designs
        const storedDesigns = localStorage.getItem(STORAGE_KEY);
        const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();
        
        // Validate cache freshness (1 hour)
        const cacheIsValid = cacheTimestamp && (now - parseInt(cacheTimestamp)) < 3600000;
        
        if (storedDesigns && cacheIsValid) {
          setDesigns(JSON.parse(storedDesigns));
          console.log('Designs loaded from cache');
        } else {
          // In a real app, fetch from API here
          const designs = JSON.parse(storedDesigns) || [];
          setDesigns(designs);
          
          // Update cache timestamp
          localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
          localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
          console.log('Cache refreshed');
        }
      } catch (error) {
        console.error('Failed to load designs', error);
        // Fallback to empty array
        setDesigns([]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      } finally {
        setLoading(false);
      }
    };
    
    loadDesigns();
  }, []);

  // Save designs to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    }
  }, [designs, loading]);

  // Add a new design - optimized with useCallback
  const addDesign = useCallback((designData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUser) throw new Error('User must be logged in to add a design');
        
        // Create new design with generated ID
        const newDesign = {
          id: `design_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          createdAt: new Date().toISOString(),
          likes: [],
          comments: [],
          ...designData
        };
        
        setDesigns(prevDesigns => [...prevDesigns, newDesign]);
        resolve(newDesign);
      }, 500);
    });
  }, [currentUser]);

  // Get a specific design by ID - memoized for performance
  const getDesignById = useCallback((id) => {
    return designs.find(design => design.id === id) || null;
  }, [designs]);

  // Get designs by user ID - memoized
  const getDesignsByUser = useCallback((userId) => {
    return designs.filter(design => design.userId === userId);
  }, [designs]);

  // Update an existing design
  const updateDesign = useCallback((id, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) return reject(new Error('User must be logged in'));
        
        const designIndex = designs.findIndex(design => design.id === id);
        
        if (designIndex === -1) {
          return reject(new Error('Design not found'));
        }
        
        const design = designs[designIndex];
        
        // Check if user owns this design
        if (design.userId !== currentUser.id) {
          return reject(new Error('You can only edit your own designs'));
        }
        
        const updatedDesign = { ...design, ...updates, updatedAt: new Date().toISOString() };
        
        const updatedDesigns = [...designs];
        updatedDesigns[designIndex] = updatedDesign;
        
        setDesigns(updatedDesigns);
        resolve(updatedDesign);
      }, 500);
    });
  }, [currentUser, designs]);

  // Delete a design
  const deleteDesign = useCallback((id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) return reject(new Error('User must be logged in'));
        
        const designIndex = designs.findIndex(design => design.id === id);
        
        if (designIndex === -1) {
          return reject(new Error('Design not found'));
        }
        
        const design = designs[designIndex];
        
        // Check if user owns this design
        if (design.userId !== currentUser.id) {
          return reject(new Error('You can only delete your own designs'));
        }
        
        const updatedDesigns = designs.filter(design => design.id !== id);
        setDesigns(updatedDesigns);
        resolve();
      }, 500);
    });
  }, [currentUser, designs]);

  // Like or unlike a design
  const toggleLike = useCallback((id) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in'));
      
      const designIndex = designs.findIndex(design => design.id === id);
      
      if (designIndex === -1) {
        return reject(new Error('Design not found'));
      }
      
      const design = designs[designIndex];
      const isLiked = design.likes.includes(currentUser.id);
      
      let updatedLikes;
      
      if (isLiked) {
        // Unlike
        updatedLikes = design.likes.filter(userId => userId !== currentUser.id);
      } else {
        // Like
        updatedLikes = [...design.likes, currentUser.id];
      }
      
      const updatedDesign = { ...design, likes: updatedLikes };
      
      const updatedDesigns = [...designs];
      updatedDesigns[designIndex] = updatedDesign;
      
      setDesigns(updatedDesigns);
      resolve({ isLiked: !isLiked, likeCount: updatedLikes.length });
    });
  }, [currentUser, designs]);

  // Add a comment to a design
  const addComment = useCallback((id, commentText) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in'));
      
      const designIndex = designs.findIndex(design => design.id === id);
      
      if (designIndex === -1) {
        return reject(new Error('Design not found'));
      }
      
      const design = designs[designIndex];
      
      const newComment = {
        id: `comment_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        text: commentText,
        createdAt: new Date().toISOString()
      };
      
      const updatedComments = [...design.comments, newComment];
      const updatedDesign = { ...design, comments: updatedComments };
      
      const updatedDesigns = [...designs];
      updatedDesigns[designIndex] = updatedDesign;
      
      setDesigns(updatedDesigns);
      resolve(newComment);
    });
  }, [currentUser, designs]);

  // Save a design to user's favorites
  const toggleSaveDesign = useCallback((id) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in'));
      
      // In a real app, you'd update user's saved designs in a database
      // For now, we'll mock this functionality with localStorage
      try {
        const SAVED_DESIGNS_KEY = `studentDesign_saved_${currentUser.id}`;
        const savedDesignsJson = localStorage.getItem(SAVED_DESIGNS_KEY) || '[]';
        const savedDesigns = JSON.parse(savedDesignsJson);
        
        const isAlreadySaved = savedDesigns.includes(id);
        let updatedSavedDesigns;
        
        if (isAlreadySaved) {
          // Remove from saved
          updatedSavedDesigns = savedDesigns.filter(designId => designId !== id);
        } else {
          // Add to saved
          updatedSavedDesigns = [...savedDesigns, id];
        }
        
        localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(updatedSavedDesigns));
        resolve({ isSaved: !isAlreadySaved });
      } catch (error) {
        reject(new Error('Failed to update saved designs'));
      }
    });
  }, [currentUser]);

  // Check if a design is saved by current user
  const isDesignSaved = useCallback((id) => {
    if (!currentUser) return false;
    
    try {
      const SAVED_DESIGNS_KEY = `studentDesign_saved_${currentUser.id}`;
      const savedDesignsJson = localStorage.getItem(SAVED_DESIGNS_KEY) || '[]';
      const savedDesigns = JSON.parse(savedDesignsJson);
      
      return savedDesigns.includes(id);
    } catch (error) {
      console.error('Error checking saved design', error);
      return false;
    }
  }, [currentUser]);
  
  // Get all saved designs for current user
  const getSavedDesigns = useCallback(() => {
    if (!currentUser) return [];
    
    try {
      const SAVED_DESIGNS_KEY = `studentDesign_saved_${currentUser.id}`;
      const savedDesignsJson = localStorage.getItem(SAVED_DESIGNS_KEY) || '[]';
      const savedDesignIds = JSON.parse(savedDesignsJson);
      
      return designs.filter(design => savedDesignIds.includes(design.id));
    } catch (error) {
      console.error('Error getting saved designs', error);
      return [];
    }
  }, [currentUser, designs]);

  // Enhanced search with multiple filters
  const searchDesigns = useCallback((query, categories = [], sortOption = 'recent') => {
    // Start with all designs
    let filtered = [...designs];
    
    // Apply text search if query exists
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(design => 
        design.title.toLowerCase().includes(lowerQuery) || 
        design.description.toLowerCase().includes(lowerQuery) ||
        design.userName.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply category filter if categories array is not empty
    if (categories && categories.length > 0) {
      filtered = filtered.filter(design => categories.includes(design.category));
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'popular':
        filtered.sort((a, b) => b.likes.length - a.likes.length);
        break;
      case 'comments':
        filtered.sort((a, b) => b.comments.length - a.comments.length);
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return filtered;
  }, [designs]);
  
  // Get related designs based on category and excluding current design
  const getRelatedDesigns = useCallback((designId, limit = 3) => {
    const currentDesign = getDesignById(designId);
    if (!currentDesign) return [];
    
    return designs
      .filter(design => 
        design.id !== designId && 
        design.category === currentDesign.category
      )
      .sort(() => 0.5 - Math.random()) // Simple random shuffle
      .slice(0, limit);
  }, [designs, getDesignById]);

  // Export trending designs (most likes in last 30 days)
  const getTrendingDesigns = useMemo(() => {
    // In a real app, you'd use actual dates
    // For this demo, we'll just use the most liked designs
    return [...designs]
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 5);
  }, [designs]);

  // Context value with memoization to prevent unnecessary renders
  const value = useMemo(() => ({
    designs,
    loading,
    addDesign,
    getDesignById,
    getDesignsByUser,
    updateDesign,
    deleteDesign,
    toggleLike,
    addComment,
    searchDesigns,
    toggleSaveDesign,
    isDesignSaved,
    getSavedDesigns,
    getRelatedDesigns,
    trendingDesigns: getTrendingDesigns,
  }), [
    designs, 
    loading, 
    addDesign, 
    getDesignById, 
    getDesignsByUser, 
    updateDesign, 
    deleteDesign, 
    toggleLike, 
    addComment, 
    searchDesigns,
    toggleSaveDesign,
    isDesignSaved,
    getSavedDesigns,
    getRelatedDesigns,
    getTrendingDesigns
  ]);

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
} 