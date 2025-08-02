import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/reusableComp/Button';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-foreground dark:bg-background text-white flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="text-[120px] font-bold text-transparent gold-gradient select-none">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-extralightgray dark:text-lightwhite">Page Not Found</h1>
        <p className="text-light mb-6 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist, got moved or is temporarily unavailable.
        </p>
        <Link
          to="/dashboard"
          // className="inline-flex items-center px-6 py-3 bg-primary text-black rounded-lg font-medium hover:bg-opacity-80 transition-all"
        >
          <Button varient="primary" className='cursor-pointer'>
          <i className="ri-arrow-left-line mr-2"></i>
          Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
