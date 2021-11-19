import axios from "axios";
import { url, StateContext } from './App';
import React, { useContext, useEffect } from "react";
import { Route, useLocation, useHistory } from "react-router-dom";

export function PrivateRoute({ children, ...rest }) {
  let [auth, setAuth] = useAuth();
  const loc = useLocation();
  const history = useHistory();
  useEffect(async () => {
    if (!auth.isLoggedIn) {
      try {
        await checkIfisLoggedIn(setAuth, auth);
      } catch (error) {
        history.push("/login");
      }
    }
  }, [loc.pathname]);

  return <>{auth.isLoggedIn &&
    <Route {...rest}>
      {children}
    </Route>
  }</>
}

function useAuth() {
  return useContext(StateContext);
}

export async function checkIfisLoggedIn(setState, state) {
  const { data: { username } } = await axios.post(url + "/login");
  setState({ ...state, isLoggedIn: true, profile: { username } });
  return true;
}

export function getTimePassed(time) {
  const date = new Date(time);
  const diff = Date.now() - date.getTime();
  const days = Number.parseInt(diff / (24 * 60 * 60 * 1000));
  const hours = Number.parseInt(diff / 60 / 60 / 1000);
  const mins = Number.parseInt(diff / 60 / 1000);
  const secs = Number.parseInt(diff / 1000);
  if (mins == 0) return secs + "s";
  if (hours == 0) return mins + "m";
  if (days == 0) return hours + "h";
  if (days > 7) return date.toLocaleDateString();
  return days + "d";
}
const $body = document.querySelector('body');
let scrollPosition = 0;
let scrollEnable = true;
export function disableScroll() {
  scrollPosition = window.pageYOffset;
  $body.style.overflow = 'hidden';
  $body.style.position = 'fixed';
  $body.style.top = `-${scrollPosition}px`;
  $body.style.width = '100%';
}
export function enableScroll() {
  $body.style.removeProperty('overflow');
  $body.style.removeProperty('position');
  $body.style.removeProperty('top');
  $body.style.removeProperty('width');
  window.scrollTo(0, scrollPosition);
}

export function toggleSroll() {
  if (scrollEnable) {
    disableScroll();
  } else {
    enableScroll();
  }
  scrollEnable = !scrollEnable;
}
