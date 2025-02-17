import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import Overlay from './context/Overlay';
import reportWebVitals from './reportWebVitals';
import ContextProvider from './context/AppContext'
import WaitingLoader from './context/WaitingLoader';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
      {/* <Overlay /> */}
      <WaitingLoader/>
    </ContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
