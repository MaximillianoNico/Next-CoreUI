const staticPage = () => {
    return {
      // Q-Apps
      '/': { page: '/auth' },
      '/dashboard': { page: '/admin' },
    };
  };
  
  module.exports = [
    { slug: '/', path: '/auth' },
    { slug: '/dashboard', path: '/admin' },
  ];
  