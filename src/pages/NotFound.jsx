import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-9xl font-bold text-primary-400">404</h1>
      
      <div className="mt-4 mb-8">
        <h2 className="text-3xl font-bold mb-2">Page not found</h2>
        <p className="text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button to="/gallery">
          Browse Gallery
        </Button>
        
        <Button to="/" variant="outline">
          Return Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound; 