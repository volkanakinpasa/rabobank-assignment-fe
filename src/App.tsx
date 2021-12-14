import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { LINKS } from './constants';
import SignUp from './pages/SignUp';

function App() {
  const { SIGN_UP } = LINKS;
  return (
    <div className="App">
      <header className="App-header">RABOBANK Logo</header>
      <main>
        <Router>
          <Routes>
            <Route path={SIGN_UP} element={<SignUp />}></Route>
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
