import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 overflow-auto bg-light">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;