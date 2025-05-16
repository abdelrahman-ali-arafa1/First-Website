import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card, { CardMedia, CardContent, CardFooter } from '../components/ui/Card';
import { UserCircleIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

function Home() {
  const { designs, loading } = useDesign();
  const { currentUser } = useAuth();
  const [featuredDesigns, setFeaturedDesigns] = useState([]);

  // Select featured designs (most liked or most recent)
  useEffect(() => {
    if (!loading && designs.length > 0) {
      // Sort by likes count (descending) or creation date if no likes
      const sorted = [...designs].sort((a, b) => {
        const likesA = a.likes.length;
        const likesB = b.likes.length;
        if (likesA === likesB) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return likesB - likesA;
      });
      setFeaturedDesigns(sorted.slice(0, 6));
    }
  }, [designs, loading]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with modern gradient background */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-24 mb-16 rounded-xl overflow-hidden">
        {/* Abstract geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Showcase Your <span className="text-secondary-300">Design</span> Projects
            </h1>
            <p className="text-xl mb-8 text-primary-100 max-w-lg">
              A platform for students to share their creative work, connect with peers, and build a stunning portfolio.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button to="/gallery" size="lg" className="px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                Browse Gallery
              </Button>
              {currentUser ? (
                <Button to="/upload" variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 px-8 py-3 rounded-full shadow-lg">
                  Upload Design
                </Button>
              ) : (
                <Button to="/register" variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 px-8 py-3 rounded-full shadow-lg">
                  Join Now
                </Button>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Modern 3D-like illustration */}
              <div className="absolute inset-0 bg-secondary-500 rounded-3xl transform rotate-6 shadow-xl"></div>
              <div className="absolute inset-0 bg-primary-400 rounded-3xl transform -rotate-3 shadow-xl"></div>
              <div className="absolute inset-0 bg-white rounded-3xl transform rotate-0 shadow-2xl overflow-hidden flex items-center justify-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary-600 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs Section */}
      <section className="mb-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured Designs</h2>
          <Link to="/gallery" className="text-primary-600 hover:text-primary-700 font-medium flex items-center group">
            View all 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : featuredDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDesigns.map((design) => (
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
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl shadow-inner">
            <p className="text-gray-600 mb-6 text-lg">No designs have been uploaded yet.</p>
            <Button to="/upload" className="px-8 py-3 rounded-full shadow-lg">Upload Your First Design</Button>
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section className="mb-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative">
            <div className="absolute -top-6 -left-6 bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">1</div>
            <div className="mb-6 h-32 flex items-center justify-center">
              <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-12 w-12 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Create an Account</h3>
            <p className="text-gray-600 text-center">Sign up in seconds to join our creative community of design students from around the world.</p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative">
            <div className="absolute -top-6 -left-6 bg-secondary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">2</div>
            <div className="mb-6 h-32 flex items-center justify-center">
              <div className="bg-secondary-100 w-24 h-24 rounded-full flex items-center justify-center">
                <svg className="h-12 w-12 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Upload Your Designs</h3>
            <p className="text-gray-600 text-center">Share your best work with detailed descriptions and showcase your unique style and talents.</p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative">
            <div className="absolute -top-6 -left-6 bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">3</div>
            <div className="mb-6 h-32 flex items-center justify-center">
              <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center">
                <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Connect & Grow</h3>
            <p className="text-gray-600 text-center">Receive valuable feedback, connect with fellow designers, and build your professional network.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mb-20 max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl p-12 text-center shadow-xl relative overflow-hidden">
          {/* Background patterns */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 20 + 5}rem`,
                  height: `${Math.random() * 20 + 5}rem`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
              ></div>
            ))}
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Showcase Your Work?</h2>
            <p className="mb-8 max-w-2xl mx-auto text-lg">Join our community of creative students and start sharing your design projects today.</p>
            {currentUser ? (
              <div className="flex flex-wrap justify-center gap-4">
                <Button to="/upload" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-full shadow-lg text-lg">
                  Upload Design
                </Button>
                <Button to={`/profile/${currentUser.id}`} variant="outline" className="bg-white text-secondary-600 hover:bg-gray-100 px-8 py-3 rounded-full shadow-lg text-lg">
                  My Portfolio
                </Button>
              </div>
            ) : (
              <Button to="/register" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-full shadow-lg text-lg">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 