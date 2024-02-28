import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import AuthContext from './AuthContext';

const ProtectedRoute = ({ children, accessBy }) => {
  const { user } = useContext(AuthContext);

  if (accessBy === 'non-authenticated') {
    if (!user) {
      return children;
    }
    return <Navigate to="/main-page"></Navigate>;
  } else if (accessBy === 'authenticated') {
    if (user) {
      console.log('Evo me ovde');
      return children;
    }
  }

  return <Navigate to="/"></Navigate>;
};

export default ProtectedRoute;
