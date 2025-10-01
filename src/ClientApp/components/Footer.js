import React from 'react';

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
      <span className="copyright ml-auto my-auto mr-2">
     Ngozi.ai © {currentYear}
      </span>
    </footer>
  );
};

export default Footer;
