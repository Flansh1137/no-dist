// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { Auth0Provider } from '@auth0/auth0-react';
// import App from './App';
// import { useNavigate } from 'react-router-dom';

// const root = createRoot(document.getElementById('root'));

// // Define the redirect after login
// const onRedirectCallback = (appState) => {
//   window.location.href = 'https://localhost:5000/login-options';
// };

// root.render(
//   <Auth0Provider
//     domain="dev-dedaezfkps23cxcu.us.auth0.com"
//     clientId="KexQt69RUglMtDtcTLm5P1tbtk0YTUUd"
//     authorizationParams={{
//       redirect_uri: window.location.origin
//     }}
//     onRedirectCallback={onRedirectCallback}
//   >
//     <App />
//   </Auth0Provider>,
// );





import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

// Define the redirect after login dynamically
const onRedirectCallback = (appState) => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/login-options`;
};

root.render(
  <Auth0Provider
    domain="dev-dedaezfkps23cxcu.us.auth0.com"
    clientId="KexQt69RUglMtDtcTLm5P1tbtk0YTUUd"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
);
