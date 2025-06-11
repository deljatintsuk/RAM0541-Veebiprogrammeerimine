import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;