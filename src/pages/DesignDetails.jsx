import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';
import { DESIGN_CATEGORIES } from '../context/DesignContext';
import Button from '../components/ui/Button';
import FormTextarea from '../components/ui/FormTextarea';
import { 
  HeartIcon as HeartOutline, 
  ChatBubbleLeftIcon, 
  CalendarIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  UserCircleIcon,
  TagIcon,
  ShareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

function DesignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getDesignById, toggleLike, addComment, deleteDesign } = useDesign();
  
  const [design, setDesign] = useState(null);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const contentRef = useRef(null);
  
  // Check if the current user has liked this design
  const isLiked = design?.likes.includes(currentUser?.id);
  
  // Check if the current user is the creator of this design
  const isOwner = currentUser && design && currentUser.id === design.userId;
  
  // Get the category name
  const categoryName = design 
    ? DESIGN_CATEGORIES.find(cat => cat.id === design.category)?.name || 'Other'
    : '';

  // Fetch design when component mounts or design ID changes
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const designData = getDesignById(id);
        if (designData) {
          setDesign(designData);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching design:', error);
        setNotFound(true);
      }
    };
    
    fetchDesign();
  }, [id, getDesignById]);

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // If design not found, show a message
  if (notFound) {
    return (
      <div className="container-narrow py-16 text-center">
        <h1 className="mb-4">Design Not Found</h1>
        <p className="text-gray-600 mb-6">
          The design you're looking for doesn't exist or has been removed.
        </p>
        <Button to="/gallery" startIcon={<ArrowUturnLeftIcon className="h-5 w-5" />}>
          Return to Gallery
        </Button>
      </div>
    );
  }
  
  // If still loading, show spinner
  if (!design) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  const handleLikeToggle = async () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate('/login', { state: { from: { pathname: `/design/${id}` } } });
      return;
    }
    
    try {
      const result = await toggleLike(design.id);
      // Update local state
      setDesign(prev => ({
        ...prev,
        likes: result.isLiked 
          ? [...prev.likes, currentUser.id]
          : prev.likes.filter(userId => userId !== currentUser.id)
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate('/login', { state: { from: { pathname: `/design/${id}` } } });
      return;
    }
    
    // Validate comment
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    setCommentError('');
    setIsSubmitting(true);
    
    try {
      const newComment = await addComment(design.id, comment.trim());
      // Update local state
      setDesign(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }));
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteDesign = async () => {
    if (!confirm('Are you sure you want to delete this design? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteDesign(design.id);
      navigate('/gallery', { 
        state: { message: 'Design successfully deleted' } 
      });
    } catch (error) {
      console.error('Error deleting design:', error);
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate multiple images for demo purposes (in a real app, this would come from the design data)
  const generateDemoImages = () => {
    if (!design.imageUrl) return [];
    
    // Simulate multiple images by using the same image
    return [
      design.imageUrl,
      design.imageUrl.replace(/(\.[^\.]+)$/, '_alt1$1'),
      design.imageUrl.replace(/(\.[^\.]+)$/, '_alt2$1'),
    ].filter(url => url === design.imageUrl); // In real app, filter would be removed
  };

  const images = [design.imageUrl]; // In a real app, we'd use generateDemoImages()

  const scrollToComments = () => {
    setActiveTab('comments');
    setTimeout(() => {
      if (contentRef.current) {
        const commentsSection = contentRef.current.querySelector('#comments-section');
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white" ref={contentRef}>
      {/* Back Navigation */}
      <div className="container-wide py-4">
        <Link to="/gallery" className="text-primary-600 hover:text-primary-700 flex items-center">
          <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
          <span>Back to Gallery</span>
        </Link>
      </div>
      
      {/* Hero Section with Split Layout */}
      <div className="bg-gray-50 py-12 mb-8">
        <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                {categoryName}
              </span>
              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-500 text-sm">{formatDate(design.createdAt)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{design.title}</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {design.description.split('\n')[0]}
            </p>
            
            <div className="flex gap-4 items-center mb-8">
              <div className="flex items-center gap-3">
                <img 
                  src={design.userAvatar} 
                  alt={design.userName} 
                  className="w-10 h-10 rounded-full border border-gray-200" 
                />
                <div>
                  <p className="font-medium">{design.userName}</p>
                  <p className="text-gray-500 text-sm">Designer</p>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center text-gray-500">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span className="text-sm">Created {formatDate(design.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleLikeToggle}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors
                  ${isLiked 
                    ? 'bg-accent-100 text-accent-700 hover:bg-accent-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                {isLiked 
                  ? <HeartSolid className="w-4 h-4" /> 
                  : <HeartOutline className="w-4 h-4" />
                }
                <span>{design.likes.length}</span>
              </button>
              
              <button
                onClick={scrollToComments}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span>{design.comments.length}</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                <ShareIcon className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              {isOwner && (
                <div className="flex items-center gap-2 ml-auto">
                  <Button 
                    variant="outline"
                    size="sm"
                    to={`/edit/${design.id}`}
                    startIcon={<PencilSquareIcon className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                  
                  <Button 
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteDesign}
                    isLoading={isDeleting}
                    startIcon={<TrashIcon className="h-4 w-4" />}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-soft-lg">
            <img 
              src={design.imageUrl} 
              alt={design.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="border-b border-gray-100 mb-8">
        <div className="container-wide">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`py-4 font-medium ${
                activeTab === 'overview' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('process')}
              className={`py-4 font-medium ${
                activeTab === 'process' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Process
            </button>
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`py-4 font-medium ${
                activeTab === 'gallery' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Gallery
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`py-4 font-medium ${
                activeTab === 'comments' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Comments ({design.comments.length})
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content with Sidebar */}
      <div className="container-wide pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="md:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="prose prose-lg max-w-none">
                <h2>Project Overview</h2>
                <p className="whitespace-pre-line">{design.description}</p>
              </div>
            )}
            
            {/* Process Tab */}
            {activeTab === 'process' && (
              <div className="prose prose-lg max-w-none">
                <h2>Design Process</h2>
                <p>
                  The design process would be described here in a real implementation.
                  This section would detail the research, inspiration, and conceptualization phases.
                </p>
                
                {/* Process Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold mb-4">1</div>
                    <h3 className="font-bold text-lg mb-2">Research</h3>
                    <p className="text-gray-600">Conducted user interviews and competitive analysis to understand the problem space</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold mb-4">2</div>
                    <h3 className="font-bold text-lg mb-2">Ideation</h3>
                    <p className="text-gray-600">Explored multiple concepts through sketching and wireframing to find the best approach</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold mb-4">3</div>
                    <h3 className="font-bold text-lg mb-2">Execution</h3>
                    <p className="text-gray-600">Refined the selected concept into the final design with attention to details</p>
                  </div>
                </div>
                
                <h3>Challenges & Solutions</h3>
                <p>
                  This section would outline the challenges faced during the project and 
                  how they were addressed through innovative design solutions.
                </p>
                
                <h3>Tools & Techniques</h3>
                <p>
                  Details about the tools, software, and techniques used to create this design
                  would be shared here, providing insight into the technical aspects.
                </p>
              </div>
            )}
            
            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {images.map((image, index) => (
                      <div key={index} className="rounded-xl overflow-hidden shadow-soft-md">
                        <img 
                          src={image} 
                          alt={`${design.title} - Image ${index + 1}`}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No additional images available for this project.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div id="comments-section">
                <h2 className="text-2xl font-bold mb-6">Comments ({design.comments.length})</h2>
                
                {currentUser ? (
                  <form onSubmit={handleCommentSubmit} className="mb-10">
                    <FormTextarea
                      placeholder="Share your thoughts on this design..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      error={commentError}
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Post Comment
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-xl shadow-soft mb-10">
                    <p className="text-gray-700 mb-3">
                      Join the conversation! Log in to leave a comment and connect with other designers.
                    </p>
                    <Link to="/login" className="btn btn-primary inline-flex">
                      Log In
                    </Link>
                  </div>
                )}
                
                {design.comments.length > 0 ? (
                  <div className="space-y-6">
                    {design.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-start gap-3 mb-3">
                          <img 
                            src={comment.userAvatar} 
                            alt={comment.userName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between">
                              <Link 
                                to={`/profile/${comment.userId}`}
                                className="font-semibold text-gray-900 hover:text-primary-600"
                              >
                                {comment.userName}
                              </Link>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 text-gray-700">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl shadow-soft">
                    <ChatBubbleLeftIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No comments yet</h3>
                    <p className="text-gray-600">Be the first to share your thoughts on this design!</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-xl sticky top-24">
              {/* Project Details */}
              <h3 className="font-bold text-lg mb-4">Project Details</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{categoryName}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formatDate(design.createdAt)}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-500">Likes</span>
                  <span className="font-medium">{design.likes.length}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-500">Comments</span>
                  <span className="font-medium">{design.comments.length}</span>
                </div>
              </div>
              
              {/* Designer Profile */}
              <h3 className="font-bold text-lg mb-4">Designer</h3>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={design.userAvatar} 
                  alt={design.userName}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h4 className="font-bold mb-1">{design.userName}</h4>
                  <p className="text-gray-500 text-sm">Designer</p>
                </div>
              </div>
              <Link 
                to={`/profile/${design.userId}`} 
                className="btn btn-primary py-2.5 w-full flex justify-center"
              >
                View Profile
              </Link>
              
              {/* Tags Section */}
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {categoryName}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Design
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Student
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Portfolio
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignDetails; 