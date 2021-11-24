import axios from "axios";
import { url, StateContext } from "./App";
import React, { useContext, useEffect } from "react";
import { Route, useLocation, useHistory } from "react-router-dom";

export function PrivateRoute({ children, ...rest }) {
  let { state: auth, setState: setAuth } = useAuth();
  const loc = useLocation();
  const history = useHistory();
  useEffect(() => {
    if (!auth.isLoggedin) {
      try {
        (async () => await checkIfisLoggedIn(setAuth, auth))();
      } catch (error) {
        history.push("/login");
      }
    }
  }, [loc.pathname]);

  return <>{auth.isLoggedin && <Route {...rest}>{children}</Route>}</>;
}

function useAuth() {
  return useContext(StateContext);
}

export async function checkIfisLoggedIn(setState, state) {
  const {
    data: { username },
  } = await axios.post(url + "/login");
  setState({ ...state, isLoggedin: true, profile: { username } });
  return true;
}

export function getTimePassed(time: string) {
  const date = new Date(time);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor(diff / 60 / 60 / 1000);
  const mins = Math.floor(diff / 60 / 1000);
  const secs = Math.floor(diff / 1000);
  if (mins == 0) return secs + "s";
  if (hours == 0) return mins + "m";
  if (days == 0) return hours + "h";
  if (days > 7) return date.toLocaleDateString();
  return days + "d";
}
const $body = document.querySelector("body");
let scrollPosition = 0;
export function disableScroll() {
  scrollPosition = window.pageYOffset;
  if ($body) {
    $body.style.overflow = "hidden";
    $body.style.position = "fixed";
    $body.style.top = `-${scrollPosition}px`;
    $body.style.width = "100%";
  }
}
export function enableScroll() {
  if ($body) {
    $body.style.removeProperty("overflow");
    $body.style.removeProperty("position");
    $body.style.removeProperty("top");
    $body.style.removeProperty("width");
    window.scrollTo(0, scrollPosition);
  }
}
