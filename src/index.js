import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '../src/font/BeVietnam-Bold.ttf';
import '../src/font/BeVietnam-ExtraBold.ttf';
import '../src/font/BeVietnam-SemiBold.ttf';
import '../src/font/BeVietnam-Regular.ttf';
import '../src/font/Gill Sans.otf';
import '../src/font/PPSupplyMono.otf'
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);

