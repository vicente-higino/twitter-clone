import React, { useContext } from "react";
import { LogoutButton } from './LogoutButton';
import { NavBarItem } from './NavBarItem';
import { StateContext } from '../App';

export function NavBar() {
  const [state] = useContext(StateContext);
  return <nav>
    <ul>
      {state.isLoggedIn && <>
        <NavBarItem activeOnlyWhenExact={true} to="/home" label="Home" />
        <NavBarItem to="/myprofile" label={`@${state.profile.username}`} />
        <LogoutButton />
      </>}
      {!state.isLoggedIn && <>
        <NavBarItem to="/login" label="Login" />
        <NavBarItem to="/signup" label="Sign Up" />
      </>}
    </ul>
  </nav>;
}
