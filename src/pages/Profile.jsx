import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import Card, { CardMedia, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import FormTextarea from '../components/ui/FormTextarea';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon,
  PencilSquareIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

function Profile() {
  const { userId } = useParams();
  const { currentUser, updateProfile } = useAuth();
  const { getDesignsByUser } = useDesign();
  
  const [user, setUser] = useState(null);
  const [userDesigns, setUserDesigns] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  // Form data for profile editing
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
  });
  
  // Check if this is the current user's profile
  const isOwnProfile = currentUser && userId === currentUser.id;
  
  // Fetch user data and designs
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, we'd fetch this from an API
        // For demo, we'll check localStorage
        const storedUsers = JSON.parse(localStorage.getItem('studentDesign_users') || '[]');
        const foundUser = storedUsers.find(u => u.id === userId);
        
        if (foundUser) {
          // Remove sensitive data before setting state
          const { password, ...userData } = foundUser;
          setUser(userData);
          
          // Set form data for editing
          setFormData({
            name: userData.name || '',
            bio: userData.bio || '',
            avatar: userData.avatar || '',
          });
          
          // Fetch user's designs
          const designs = getDesignsByUser(userId);
          setUserDesigns(designs);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setNotFound(true);
      }
    };
    
    fetchUserData();
  }, [userId, getDesignsByUser]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      const updatedUser = await updateProfile({
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar,
      });
      
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (notFound) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">
          The user profile you're looking for doesn't exist or has been removed.
        </p>
        <Button to="/gallery">
          Return to Gallery
        </Button>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Header/Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-400"></div>
        
        {/* Profile Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start -mt-16 md:-mt-12">
            {/* Avatar */}
            <div className="mb-4 md:mb-0 md:mr-6">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md" 
              />
            </div>
            
            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-gray-600 text-sm flex items-center justify-center md:justify-start">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Member since {formatDate(user.createdAt)}</span>
                  </p>
                </div>
                
                {isOwnProfile && !isEditing && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    startIcon={<PencilSquareIcon className="h-4 w-4" />}
                    className="mt-4 md:mt-0"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {!isEditing ? (
                <div className="mt-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {user.bio || 'No bio provided.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormInput
                      label="Name"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                    />
                    
                    <FormInput
                      label="Avatar URL"
                      id="avatar"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  
                  <FormTextarea
                    label="Bio"
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell others about yourself"
                    rows={3}
                  />
                  
                  <div className="flex justify-end space-x-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      loadingText="Saving..."
                    >
                      Save Profile
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* User Designs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {isOwnProfile ? 'Your Designs' : `${user.name}'s Designs`}
        </h2>
        
        {userDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userDesigns.map((design) => (
              <Card key={design.id} hoverEffect>
                <Link to={`/design/${design.id}`}>
                  <CardMedia 
                    src={design.imageUrl} 
                    alt={design.title}
                    aspectRatio="aspect-[4/3]"
                  />
                </Link>
                <CardContent>
                  <Link to={`/design/${design.id}`}>
                    <h3 className="font-bold text-lg mb-2 hover:text-primary-600">
                      {design.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 line-clamp-2 text-sm">
                    {design.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between text-gray-500 text-sm">
                  <div className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    <span>{design.likes.length}</span>
                  </div>
                  <div className="flex items-center">
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                    <span>{design.comments.length}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {isOwnProfile 
                ? "You haven't uploaded any designs yet." 
                : `${user.name} hasn't uploaded any designs yet.`}
            </p>
            
            {isOwnProfile && (
              <Button to="/upload">
                Upload Your First Design
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile; 