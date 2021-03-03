import './App.css';
import React, { useState } from "react";
import { config } from "./config";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LogoutButton } from './LogoutButton';
import { NavBarItem } from './NavBarItem';
import { SignUp } from './SignUp';
import { Home } from './Home';
import { PublicProfile } from './PublicProfile';
import { Profile } from './Profile';
import { Login } from './Login';

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
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/myprofile">
            <Profile />
          </Route>
          <Route exact path="/profile/:username">
            <PublicProfile />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
        </Switch>
      </StateContext.Provider>
    </Router >
  );
}
export default App;
