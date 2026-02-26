import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- ROUTING PATHNAME FIX ---
// Automatically redirect users who type `/portal` or `/admin` manually
// because this app uses HashRouter (e.g., /#/portal).
const path = window.location.pathname;
if (path && path !== '/' && path !== '/index.html' && path !== '/index.php') {
  // Redirect unhashed URL path into a hashed one (e.g., /admin -> /#/admin)
  window.location.replace(window.location.origin + '/#' + path + window.location.search + window.location.hash);
} else {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
