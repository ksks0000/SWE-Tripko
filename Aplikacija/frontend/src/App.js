import React, { useState } from 'react';
import './App.css';
import PregledZnamenitosti from './components/pregledZnamenitosti/PregledZnamenitosti';
import PreDodavanjeRute from './components/dodavanjeRute/preDodavanjaRute';
import Index from './components/indexComponent/Index';
import SingInUp from './components/signInUpComponent/SignInUp';
import Main from './components/mainPageComponents/Main';
import Profile from './components/profileComponent/Profile';
import PretragaRute from './components/pretragaRute/PretragaRute';
import MapaPretragaRute from './components/pretragaRute/MapaPretragaRute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInUp from './components/signInUpComponent/SignInUp';
import DodavanjeRute from './components/dodavanjeRute/DodavanjeRute';
import { AuthContextProvider } from './components/authentication/AuthContext';
import ProtectedRoute from './components/authentication/ProtectedRoute';

export default function App() {
  return (
    <AuthContextProvider>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute accessBy="non-authenticated">
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="sign-in-up"
            element={
              <ProtectedRoute accessBy="non-authenticated">
                <SignInUp />
              </ProtectedRoute>
            }
          />
          <Route
            path="main-page"
            element={
              <ProtectedRoute accessBy="authenticated">
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/main-page/pretraga-rute/:tipRuta"
            element={
              <ProtectedRoute accessBy="authenticated">
                <PretragaRute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/main-page/pretraga-rute/pretrazena-ruta-mapa/:routeId"
            element={
              <ProtectedRoute accessBy="authenticated">
                <MapaPretragaRute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/main-page/profile"
            element={
              <ProtectedRoute accessBy="authenticated">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/main-page/pre-dodavanja-rute"
            element={
              <ProtectedRoute accessBy="authenticated">
                <PreDodavanjeRute />
              </ProtectedRoute>
            }
          />
          <Route
            path="pregled-znamenitosti"
            element={
              <ProtectedRoute accessBy="authenticated">
                <PregledZnamenitosti />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthContextProvider>
  );
}
