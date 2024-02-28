import React, { useContext, useState } from 'react';
import './profile-style.css';
import img from '../images/profile-image.jpg';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuthContext from '../authentication/AuthContext';
import {
  extractIDFromToken,
  extractRoleFromToken,
} from '../authentication/AuthContext';
import jwtInterceptor from '../authentication/jwtInterceptor';

export default function Profile({}) {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPopupPasswordOpen, setPopupPasswordOpen] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [toggleIcon, setToggleIcon] = useState('fa-eye');
  const [isGuide, setIsGuide] = useState(true);
  const [profileImg, setProfileImg] = useState(img);
  const [formData, setFormData] = React.useState({
    ime: '.',
    prezime: '.',
    password: '',
    grad: '',
    drzava: '',
    datumRodjenja: null,
    pol: '',
  });

  const role = extractRoleFromToken();
  const userId = extractIDFromToken();

  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const openPopup = () => {
    setPopupOpen(true);
  };

  const openPopupPassword = () => {
    setPopupPasswordOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const closePopupPassword = () => {
    setPopupPasswordOpen(false);
  };

  const handleFileUpload = (event) => {
    const profilePicture = document.getElementById('Profile-picture');
    const inputFile = document.getElementById('Input-file');

    if (inputFile !== null) {
      profilePicture.src = URL.createObjectURL(inputFile.files[0]);
    }

    const formData = new FormData();
    formData.append('profileImage', inputFile.files[0]);

    jwtInterceptor
      .post('http://localhost:5174/ProfilnaSlika/DodajProfilnuSliku', formData)
      .then((response) => {
        console.log('Slika je uspesno dodata na server.');
      })
      .catch((error) => {
        console.error('Doslo je do greske prilikom preuzimanja slike.', error);
      });
  };

  // const handleTogglePassword = () => {
  //   const togglePassword = document.querySelector('#Toggle-password');
  //   const password = document.querySelector('#Password');

  //   const type =
  //     password.getAttribute('type') === 'password' ? 'text' : 'password';
  //   password.setAttribute('type', type);
  //   togglePassword.classList.toggle('fa-eye-slash');
  // };

  // const handleTogglePassword = () => {
  //   setPasswordType((prevType) =>
  //     prevType === 'password' ? 'text' : 'password'
  //   );
  //   setToggleIcon((prevIcon) =>
  //     prevIcon === 'fa-eye' ? 'fa-eye-slash' : 'fa-eye'
  //   );
  // };

  const handleTogglePassword = () => {
    setPasswordType((prevType) =>
      prevType === 'password' ? 'text' : 'password'
    );
    setToggleIcon((prevIcon) =>
      prevIcon === 'fa-eye' ? 'fa-eye-slash' : 'fa-eye'
    );
  };

  const handleDeleteAccount = () => {
    openPopup();
  };

  const handleChangePassword = () => {
    openPopupPassword();
  };

  const handleDeleteConfirmation = () => {
    jwtInterceptor
      .delete('http://localhost:5174/Autentifikacija/ObrisiLicniProfil')
      .then((response) => logout())
      .catch((error) => console.log(error.response.data));
  };

  const handlePasswordChanges = () => {
    const inputPasswordNew = document.getElementById('PasswordNew');
    const inputPassword = document.getElementById('Password');
    const newPassword = inputPasswordNew.value;

    if (inputPassword.value === '' || inputPasswordNew.value === '') {
      alert('Enter your old and new password');
    } else {
      jwtInterceptor
        .put(`http://localhost:5174/Turista/IzmeniLozniku/${newPassword}`)
        .then((response) => {
          console.log('Lozinka je uspesno promenjena');
        })
        .catch((error) => {
          console.error('Doslo je do greske prilikom promene lozinke', error);
        });
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    const { ime, prezime, datumRodjenja, grad, drzava, pol } = formData;
    const url = `http://localhost:5174/Turista/IzmeniLicnePodatke/${ime}/${prezime}/${datumRodjenja}/${grad}/${drzava}/${pol}?brojTel=${'+381'}`;
    jwtInterceptor
      .put(url)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error.response.data));
    navigate('/main-page', { replace: true });
    //fetch u suprotan smer -> azuriranje profila korisnika
  }

  console.log({ userId, role });
  useEffect(() => {
    if (role === 'turista') {
      setIsGuide(false);
      jwtInterceptor
        .get(`http://localhost:5174/Turista/PreuzmiTuristu/${userId}`)
        .then((response) => {
          setFormData(response.data[0]);
        })
        .then(() => {
          setFormData((prevData) => {
            return {
              ...prevData,
              datumRodjenja: prevData.datumRodjenja.split('T')[0],
            };
          });
        });
    } else if (role === 'vodic' || role === 'power-vodic') {
      jwtInterceptor
        .get(`http://localhost:5174/Vodic/PreuzmiVodica/${userId}`)
        .then((response) => {
          setFormData(response.data[0]);
        })
        .then(() => {
          setFormData((prevData) => {
            return {
              ...prevData,
              datumRodjenja: prevData.datumRodjenja.split('T')[0],
            };
          });
        });
    }
  }, []);

  function handleChange(event) {
    const { ime, prezime, grad, drzava, datumRodjenja, pol } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
    console.log(formData);
  }

  function handlePromotionRequest() {
    const url = `http://localhost:5174/Tripko/OdobriPromocijuVodica/${userId}`;
    if (role === 'vodic') {
      jwtInterceptor
        .put(url)
        .then((response) => {})
        .then(() => logout())
        .catch((err) => console.log(err.response.data));
    } else {
      alert('Only regular tour guides can promote');
    }
  }

  // preuzimanje slike ali proble pri ucitavanju
  // useEffect(() => {
  //   jwtInterceptor
  //     .get(`http://localhost:5174/ProfilnaSlika/PreuzmiProfilnuSliku`)
  //     .then((response) => {
  //       console.log(response);
  //       const imageBlob = new Blob([response.data], { type: response.contentType });
  //       const imageUrl = URL.createObjectURL(imageBlob);
  //       setProfileImg(imageUrl);
  //     })
  //     .catch((error) => {
  //       console.log('Greska prilikom preuzimanja slike:', error);
  //     });
  // }, []);

  return (
    <div className="profile-container">
      <div className="container">
        <a
          onClick={() => navigate('/main-page', { replace: true })}
          className="previous round"
        >
          &#8249; Back
        </a>
        <div className="profile">
          <div className="hero">
            <div className="image">
              <img
                src={profileImg ? profileImg : img}
                id="Profile-picture"
                alt="profile picture"
              />
            </div>
            <div>
              <h3>
                {formData.ime} {formData.prezime}
              </h3>
              <h4>{role.toLocaleUpperCase()}</h4>
            </div>
          </div>
          <div className="settings">
            <div>
              <label htmlFor="Input-file">Update image</label>
              <input
                className="input-profile"
                id="Input-file"
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileUpload}
              />
              <label id="Void"></label>
            </div>
            <button
              id={'Change-password' + (!isGuide ? '2' : '')}
              onClick={handleChangePassword}
            >
              Change Password
            </button>
            <div
              className={`popupPassword ${
                isPopupPasswordOpen ? 'open-popup' : ''
              }`}
              id="PopupPassword"
            >
              <div className="infield">
                <h2>Change your password</h2>
                <h4>Enter old and new password</h4>
                <div className="pass-div">
                  <input
                    className=""
                    type={passwordType}
                    id="Password"
                    placeholder="Password"
                    required
                    name="password"
                    onChange={handleChange}
                  />
                  <i
                    className={`fa ${toggleIcon}`}
                    id="Toggle-password"
                    onClick={handleTogglePassword}
                  ></i>
                  <input
                    className=""
                    type={passwordType}
                    id="PasswordNew"
                    placeholder="New Password"
                    required
                    name="newpassword"
                    onChange={handleChange}
                  />
                  {/* <i
                    className="far fa-eye"
                    id="Toggle-new-password"
                    onClick={handleTogglePassword}
                  ></i> */}
                </div>
                <div>
                  <button id="ChangePassword-back" onClick={closePopupPassword}>
                    Back
                  </button>
                  <button
                    id="ChangePassword-change"
                    onClick={handlePasswordChanges}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
            {isGuide && (
              <button
                id="Promote-to-powerguide"
                onClick={handlePromotionRequest}
              >
                Promotion request
              </button>
            )}
            <button
              id={'Delete-account' + (!isGuide ? '2' : '')}
              onClick={handleDeleteAccount}
            >
              Delete account
            </button>
            <div
              className={`popup ${isPopupOpen ? 'open-popup' : ''}`}
              id="Popup"
            >
              <div>
                <h2>Delete account</h2>
                <h4>
                  Are you sure you want to permanently delete your account?
                </h4>
                <div>
                  <button id="Delete-no" onClick={closePopup}>
                    No
                  </button>
                  <button id="Delete-yes" onClick={handleDeleteConfirmation}>
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-div">
          <form onSubmit={handleSubmit}>
            <h1>Edit your profile</h1>
            <div className="infield">
              <input
                className="input-profile"
                type="text"
                placeholder="First Name"
                required
                name="ime"
                value={formData.ime}
                onChange={handleChange}
              />
              <label></label>
            </div>
            <div className="infield">
              <input
                className="input-profile"
                type="text"
                placeholder="Last Name"
                required
                name="prezime"
                value={formData.prezime}
                onChange={handleChange}
              />
              <label></label>
            </div>
            <div className="infield">
              <input
                className="input-profile"
                type="text"
                placeholder="City"
                name="grad"
                value={formData.grad}
                onChange={handleChange}
              />
              <label></label>
            </div>
            <div className="infield">
              <input
                className="input-profile"
                type="text"
                placeholder="Country"
                required
                name="drzava"
                value={formData.drzava}
                onChange={handleChange}
              />
              <label></label>
            </div>
            <div id="Birth-and-gender-div" className="infield">
              <div id="Gender-input-div">
                <input
                  className="input-profile"
                  type="date"
                  placeholder="Birth Date"
                  name="datumRodjenja"
                  value={formData.datumRodjenja}
                  onChange={handleChange}
                />
                <label id="Birth-underline"></label>
              </div>
              <div>
                <select
                  className="select-profile"
                  name="pol"
                  onChange={handleChange}
                  value={formData.pol}
                >
                  <option value="M">Male</option>
                  <option value="Z">Female</option>
                </select>
                <label></label>
              </div>
            </div>
            <button id="Save-changes-button">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
