import axios from 'axios';
import { createContext, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token');
      return jwt_decode(token);
    }
    return null;
  });

  const navigate = useNavigate();

  const login = async (payload) => {
    try {
      const apiResponse = await axios.post(
        'http://localhost:5174/Autentifikacija/Prijavljivanje',
        payload
      );
      localStorage.setItem('token', apiResponse.data);
      console.log(apiResponse.data);
      setUser(jwt_decode(apiResponse.data));
      navigate('/');
    } catch (error) {
      alert('Invalid email or password! Please try again.');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const extractRoleFromToken = () => {
  const token = localStorage.getItem('token');
  const decodedToken = atob(token.split('.')[1]);
  const role = decodedToken.split(',')[2].split(':')[2].split('"')[1];
  return role;
};

export const extractIDFromToken = () => {
  const token = localStorage.getItem('token');
  const decodedToken = atob(token.split('.')[1]);
  const id = decodedToken.split(',')[0].split(':')[2].split('"')[1];
  return id;
};

export default AuthContext;
