import React from 'react';
import { Link } from 'react-router-dom';
const MainNav = () => {
  return (
    <div>
      <nav id="main-nav" className="light-blue">
        <Link to="/">Home</Link>
      </nav>
    </div>
  );
};

export default MainNav;
