import './App.css';
import React, { useState } from "react";
import { config } from "./config";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { SignUp } from './pages/SignUp';
import { Home } from './pages/Home';
import { PublicProfile } from './pages/PublicProfile';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { PrivateRoute } from "./utils"
import { NavBar, SearchPage } from './components/NavBar';

export const url = config.url.API;
export const StateContext = React.createContext({});

function App() {
  const [state, setState] = useState({ isLoggedIn: false, profile: {} });
  return (
    <Router>
      <StateContext.Provider value={[state, setState]}>
        <NavBar />
        <Switch>
          <PrivateRoute exact path="/home">
            <Home />
          </PrivateRoute>
          <Route exact path="/login">
            <Login />
          </Route>
          <PrivateRoute exact path="/myprofile">
            <Profile />
          </PrivateRoute>
          <PrivateRoute exact path="/profile/:username">
            <PublicProfile />
          </PrivateRoute>
          <PrivateRoute exact path="/search">
            <SearchPage />
          </PrivateRoute>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route>
            <Redirect to="/home" />
          </Route>
        </Switch>
      </StateContext.Provider>
    </Router >
  );
}
export default App;

