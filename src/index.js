import React, {Suspense, lazy} from 'react';
import {HashRouter as Router} from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import {SnackbarProvider} from 'notistack';

const App = lazy(() => import('./App'));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div />}>
      <Router>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </Router>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
