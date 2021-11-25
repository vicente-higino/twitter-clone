import axios from "axios";
import { url, StateContext, AppState } from "./App";
import React, { FC, useContext, useEffect } from "react";
import { Route, useLocation, useHistory, RouteProps, RouterProps } from "react-router-dom";

export const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  let { state } = useContext(StateContext);
  useCheckIfIsLoggedIn();
  return <>{state.isLoggedin && <Route {...rest}>{children}</Route>}</>;
};

type checkLogin = (
  setState: React.Dispatch<React.SetStateAction<AppState>>,
  state: AppState,
  history: any
) => Promise<boolean>;

export const useCheckIfIsLoggedIn = () => {
  let { state, setState } = useContext(StateContext);
  const loc = useLocation();
  const history = useHistory();
  useEffect(() => {
    (async () => {
      if (!state.isLoggedin) {
        try {
          const {
            data: { username },
          } = await axios.post<{ username: string }>(url + "/login");
          setState && setState({ ...state, isLoggedin: true, profile: { username } });
        } catch (error) {
          history.push("/login");
        }
      }
    })();
  }, [loc.pathname]);
};

export const checkIfisLoggedIn: checkLogin = async (setState, state, history) => {
  if (!state.isLoggedin) {
    try {
      const {
        data: { username },
      } = await axios.post(url + "/login");
      setState({ ...state, isLoggedin: true, profile: { username } });
      return true;
    } catch (error) {
      history.push("/login");
    }
  }
  return false;
};

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
let scrollEnable = true;
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

export function toggleSroll() {
  if (scrollEnable) {
    disableScroll();
  } else {
    enableScroll();
  }
  scrollEnable = !scrollEnable;
}
