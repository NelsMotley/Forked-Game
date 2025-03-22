import React from 'react';
import ReactDOM from 'react-dom';

//Allow the arm to be rendered on top of the inverse overlay
const ArmPortal = ({ children }) => {
  const portalRoot = document.getElementById("portal-root");
  return ReactDOM.createPortal(children, portalRoot);
};

export default ArmPortal;