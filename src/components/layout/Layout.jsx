import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { DesignProvider } from '../../context/DesignContext';

function Layout() {
  return (
    <DesignProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </DesignProvider>
  );
}

export default Layout; 