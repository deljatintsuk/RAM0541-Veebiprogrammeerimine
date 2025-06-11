import React from 'react';
import { useAppSelector } from '../hooks/redux-hooks';

const ProfilePage: React.FC = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3><strong>{currentUser?.username}</strong> profiil</h3>
      </header>
      <p><strong>Id:</strong> {currentUser?.id}</p>
      <p><strong>Email:</strong> {currentUser?.email}</p>
      <strong>Roll:</strong> {currentUser?.role}
    </div>
  );
};

export default ProfilePage;