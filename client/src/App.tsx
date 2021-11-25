import "./App.css";
import React, { FC, useState } from "react";
import { config } from "./config";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import { Home } from "./pages/Home";
import { PublicProfile } from "./pages/PublicProfile";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./utils";
import { NavBar } from "./components/NavBar";

type ProfileType = {
  username: string;
};

interface AppState {
  isLoggedin: boolean;
  profile: ProfileType | undefined;
}

export const url = config.url.API;

interface IStateContext {
  state: AppState;
  setState?: React.Dispatch<React.SetStateAction<AppState>>;
}

const defaultState: IStateContext = {
  state: {
    isLoggedin: false,
    profile: { username: " " },
  },
};
export const StateContext = React.createContext<IStateContext>(defaultState);

export const StateContextProvider: FC = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isLoggedin: false,
    profile: { username: "" },
  });
  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

function App() {
  return (
    <Router>
      <StateContextProvider>
        <NavBar />
        <Switch>
          <PrivateRoute exact path="/home">
            <Home />
          </PrivateRoute>
          <Route exact path="/login">
            <Login />
          </Route>
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
      </StateContextProvider>
    </Router>
  );
}
export default App;
