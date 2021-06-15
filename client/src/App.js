import './App.css';
import React, { useState } from "react";
import { config } from "./config";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { LogoutButton } from './LogoutButton';
import { NavBarItem } from './NavBarItem';
import { SignUp } from './pages/SignUp';
import { Home } from './pages/Home';
import { PublicProfile } from './pages/PublicProfile';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { PrivateRoute } from "./utils"
 
export const url = config.url.API;
export const StateContext = React.createContext();

function App() {
  const [state, setState] = useState({ isLoggin: false, profile: {} });
  return (
    <Router>
      <StateContext.Provider value={[state, setState]}>
        <nav>
          <ul>
            {state.isLoggin && <>
              <NavBarItem activeOnlyWhenExact={true} to="/home" label="Home" />
              <NavBarItem to="/myprofile" label={"@" + state.profile.username} />
              <LogoutButton />
            </>}
            {!state.isLoggin && <>
              <NavBarItem to="/login" label="Login" />
              <NavBarItem to="/signup" label="Sign Up" />
            </>}
          </ul>
        </nav>
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
