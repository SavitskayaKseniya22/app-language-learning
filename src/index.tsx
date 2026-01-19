import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import Spinner from './components/spinner/Spinner';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Suspense fallback={<Spinner />}>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>
);
