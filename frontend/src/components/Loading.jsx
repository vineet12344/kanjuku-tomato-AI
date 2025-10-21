import React from 'react';

/**
 * A simple wrapper component for the loading screen.
 * It takes other elements as children and displays them
 * inside a styled container div.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The elements to be rendered inside the loading screen.
 * @returns {JSX.Element} The rendered component.
 */
const Loading = ({ children }) => {
  return (
    <div className="loading-screen" style={{backgroundColor:"#6B8E23"}}>
      {children}
    </div>
  );
};

export default Loading;