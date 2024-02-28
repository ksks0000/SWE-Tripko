import React, { useContext, useState } from 'react';
import './signInUp-style.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../authentication/AuthContext';
import axios from 'axios';
import tripko from '../images/tripko.jpeg';

export default function SignInUp() {
  const [isSignUpActive, setSignUpActive] = useState(false); //
  const [isTourGuide, setTourGuide] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [signupTuristData, setSignupTuristData] = useState({
    ime: '',
    prezime: '',
    email: '',
    password: '',
    datumRodjenja: '',
    grad: '',
    tipNaloga: 'turista',
    drzava: 'Srbija',
    pol: 'M',
    brojTelefona: '',
  });

  const [signupGuideData, setSignupGuideData] = useState({
    ime: '',
    prezime: '',
    email: '',
    password: '',
    datumRodjenja: '',
    grad: '',
    tipNaloga: 'vodic',
    drzava: 'Srbija',
    pol: 'M',
    brojTelefona: '',
    Diploma: '',
  });

  const { login } = useContext(AuthContext);

  const loginSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let payload = {
      email: loginData.email,
      password: loginData.password,
    };
    await login(payload);
  };

  const navigate = useNavigate();

  const toggleSignUp = () => {
    setSignUpActive(!isSignUpActive);
  };
  const toggleSignIn = () => {
    setSignUpActive(!isSignUpActive);
  };

  const btnTourGuide = document.getElementById('Tour-guide');
  const toggleTourGuide = () => {
    setTourGuide((prev) => !prev);
  };

  const handleTogglePassword = (e) => {
    e.stopPropagation();
    setShowPassword((prev) => !prev);
    console.log(!showPassword);
  };

  function handleLoginChange(event) {
    const { email, password } = event.target;
    setLoginData((prevFromData) => {
      return {
        ...prevFromData,
        [event.target.name]: event.target.value,
      };
    });
  }
  function handleSignupTuristChange(event) {
    const { ime, prezime, email, password, datumRodjenja, grad, drzava, pol } =
      event.target;
    setSignupTuristData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  }
  function handleSignupGuideChange(event) {
    const {
      ime,
      prezime,
      email,
      password,
      datumRodjenja,
      grad,
      drzava,
      pol,
      brojTelefona,
    } = event.target;
    if (event.target.name === 'Diploma') {
      const file = event.target.files[0];
      setSelectedFile(file);
    } else
      setSignupGuideData((prevData) => {
        return {
          ...prevData,
          [event.target.name]: event.target.value,
        };
      });
  }
  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }
  function SignupSubmit(event) {
    event.preventDefault();
    if (isTourGuide) {
      if (
        signupGuideData.ime &&
        signupGuideData.prezime &&
        signupGuideData.email &&
        signupGuideData.password &&
        signupGuideData.datumRodjenja &&
        signupGuideData.grad &&
        signupGuideData.drzava &&
        signupGuideData.pol &&
        signupGuideData.brojTelefona &&
        selectedFile
      ) {
        if (confirmPassword !== signupGuideData.password) {
          alert("Passwords don't match");
          return;
        }
        const datum = signupGuideData.datumRodjenja + 'T00:00:00.111Z';
        setSignupGuideData((prevData) => {
          return { ...prevData, datumRodjenja: datum };
        });
        const registerUser = async () => {
          try {
            const formData = new FormData();
            formData.append('Ime', signupGuideData.ime);
            formData.append('Prezime', signupGuideData.prezime);
            formData.append('Email', signupGuideData.email);
            formData.append('Password', signupGuideData.password);
            formData.append('DatumRodjenja', datum);
            formData.append('Grad', signupGuideData.grad);
            formData.append('Drzava', signupGuideData.drzava);
            formData.append('Pol', signupGuideData.pol);
            formData.append('BrojTelefona', signupGuideData.brojTelefona);
            formData.append('Diploma', selectedFile);

            const response = await axios.post(
              'http://localhost:5174/Autentifikacija/RegistracijaVodic',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            window.location.reload(false);
          } catch (error) {
            console.error(error.response.data);
          }
        };
        registerUser();
      } else {
        alert('Please input all the data');
      }
    } else {
      if (
        !signupTuristData.ime ||
        !signupTuristData.prezime ||
        !signupTuristData.email ||
        !signupTuristData.password ||
        !signupTuristData.datumRodjenja ||
        !signupTuristData.grad ||
        !signupTuristData.drzava ||
        !signupTuristData.pol
      ) {
        alert('Please input all the data');
        return;
      }
      if (signupTuristData.password !== confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      const datum = signupTuristData.datumRodjenja + 'T00:00:00.111Z';
      setSignupTuristData((prevData) => {
        return { ...prevData, datumRodjenja: datum };
      });
      setSignupTuristData((prevData) => {
        return {
          ime: prevData.ime,
          prezime: prevData.prezime,
          email: prevData.email,
          password: prevData.password,
          datumRodjenja: prevData.datumRodjenja,
          grad: prevData.grad,
          tipNaloga: prevData.tipNaloga,
          drzava: prevData.drzava,
          pol: prevData.pol,
          brojTelefona: prevData.brojTelefona,
        };
      });
      const objectToSend = JSON.stringify(signupTuristData);
      const registerUser = async () => {
        try {
          const response = await axios.post(
            'http://localhost:5174/Autentifikacija/RegistracijaTurista',
            objectToSend,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        } catch (error) {
          console.error(error);
        }
      };
      registerUser();
    }
  }

  const handleFogotPassword = () => {
    // alert("Please try to remember :D");
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className="signInUp-container">
      <div
        className={`container ${isSignUpActive ? 'right-panel-active' : ''}`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form id="Form1" onSubmit={SignupSubmit}>
            <h1>Create Account</h1>
            <div id="Name-div" className="infield">
              <div id="First-name-div">
                <input
                  type="text"
                  placeholder="First Name"
                  name="ime"
                  required
                  onChange={
                    isTourGuide
                      ? handleSignupGuideChange
                      : handleSignupTuristChange
                  }
                  value={
                    isTourGuide
                      ? handleSignupGuideChange.ime
                      : handleSignupTuristChange.ime
                  }
                />
                <label id="First-name-label-underline"></label>
              </div>
              <div id="Last-name-div">
                <input
                  type="text"
                  placeholder="Last Name"
                  name="prezime"
                  required
                  onChange={
                    isTourGuide
                      ? handleSignupGuideChange
                      : handleSignupTuristChange
                  }
                  value={
                    isTourGuide
                      ? handleSignupGuideChange.prezime
                      : handleSignupTuristChange.prezime
                  }
                />
                <label id="Last-name-label-underline"></label>
              </div>
            </div>
            <div className="infield">
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                onChange={
                  isTourGuide
                    ? handleSignupGuideChange
                    : handleSignupTuristChange
                }
                value={
                  isTourGuide
                    ? handleSignupGuideChange.email
                    : handleSignupTuristChange.email
                }
              />
              <label></label>
            </div>
            <div id="Password-div" className="infield">
              <div id="Password-password-div">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="Password"
                  placeholder="Password"
                  name="password"
                  onChange={
                    isTourGuide
                      ? handleSignupGuideChange
                      : handleSignupTuristChange
                  }
                  required
                />
                <label id="Password-label-underline"></label>
              </div>
              <div id="Password-confirm-password-div">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="Confirm-password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <i
                  className={showPassword ? 'fas fa-eye' : 'far fa-eye'}
                  id="Toggle-password"
                  onClick={handleTogglePassword}
                ></i>

                <label id="Confirm-password-label-underline"></label>
              </div>
            </div>
            <div className="infield">
              <input
                type="text"
                placeholder="City"
                name="grad"
                onChange={
                  isTourGuide
                    ? handleSignupGuideChange
                    : handleSignupTuristChange
                }
                value={
                  isTourGuide
                    ? handleSignupGuideChange.grad
                    : handleSignupTuristChange.grad
                }
              />
              <label></label>
            </div>
            <div id="Birth-and-gender-div" className="infield">
              <div id="Gender-input-div">
                <input
                  type="date"
                  placeholder="Birth Date"
                  name="datumRodjenja"
                  onChange={
                    isTourGuide
                      ? handleSignupGuideChange
                      : handleSignupTuristChange
                  }
                  value={
                    isTourGuide
                      ? handleSignupGuideChange.datumRodjenja
                      : handleSignupTuristChange.datumRodjenja
                  }
                />
                <label id="Birth-underline"></label>
              </div>
              <div>
                <select
                  name="pol"
                  onChange={
                    isTourGuide
                      ? handleSignupGuideChange
                      : handleSignupTuristChange
                  }
                  value={
                    isTourGuide
                      ? handleSignupGuideChange.pol
                      : handleSignupTuristChange.pol
                  }
                >
                  <option value="m">Male</option>
                  <option value="z">Female</option>
                </select>
                <label></label>
              </div>
            </div>

            {isTourGuide && (
              <div
                id="Phone-document-div"
                className={
                  isTourGuide
                    ? 'infield show-phone-document-div'
                    : 'infield phone-document-div'
                }
                value={
                  isTourGuide
                    ? handleSignupGuideChange.brojTelefona
                    : handleSignupTuristChange.brojTelefona
                }
              >
                <div id="Phone-div">
                  <input
                    type="tel"
                    name="brojTelefona"
                    placeholder="Phone Number"
                    pattern="[0-9]{10}"
                    onChange={handleSignupGuideChange}
                    required
                  />
                  <label id="Phone-underline"></label>
                </div>

                <div id="Document-div">
                  <label id="Input-document" htmlFor="Input-file">
                    Upload document image
                  </label>

                  <input
                    className="input-document"
                    name="Diploma"
                    id="Input-file"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleSignupGuideChange}
                  />
                </div>
              </div>
            )}

            <div className="btn-box">
              <button id="Tour-guide" type="button" onClick={toggleTourGuide}>
                {isTourGuide ? 'Sign up as Tourist' : 'Sign up as Tour Guide'}
              </button>
              <button id="Sign-up-button" onClick={SignupSubmit}>
                Sign up
              </button>
            </div>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form id="Form2" action="#">
            <h1>Sign in</h1>
            <div className="infield">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <label></label>
            </div>
            <div className="infield">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                required
                onChange={handleLoginChange}
              />
              <label></label>
            </div>
            <a href="#" className="forgot" onClick={handleFogotPassword}>
              Forgot your password?
            </a>
            <div
              className={`popup ${isPopupOpen ? 'open-popup' : ''}`}
              id="Popup"
            >
              <img src={tripko}></img>
              <button id="Delete-no" onClick={closePopup}>
                Ok :D
              </button>
            </div>
            <button id="Sing-in-button" onClick={loginSubmit}>
              Sign In
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login on your account</p>
              <button className="ghost" id="signIn" onClick={toggleSignIn}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button
                className="ghost"
                id="signUp"
                type="button"
                onClick={toggleSignUp}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
