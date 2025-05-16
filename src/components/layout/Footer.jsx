import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and info */}
          <div>
            <h2 className="text-xl font-display font-bold mb-4">Student Design</h2>
            <p className="text-gray-300 mb-4">
              A platform for students to showcase their design projects and get inspired by others.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-white">Gallery</Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-300 hover:text-white">Upload Design</Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/gallery?category=graphic" 
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600"
              >
                Graphic Design
              </Link>
              <Link 
                to="/gallery?category=ui" 
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600"
              >
                UI/UX
              </Link>
              <Link 
                to="/gallery?category=industrial" 
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600"
              >
                Industrial
              </Link>
              <Link 
                to="/gallery?category=architecture" 
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600"
              >
                Architecture
              </Link>
              <Link 
                to="/gallery?category=fashion" 
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600"
              >
                Fashion
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; {year} Student Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 