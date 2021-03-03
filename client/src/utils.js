import axios from "axios";
import { url } from './App';

export async function checkIfIsLoggedIn(setState, state) {
  await axios.post(url + "/login");
  const { data: { username } } = await axios.get(url + "/profile");
  setState({ ...state, isLoggin: true, profile: { username } });
}

export function getTimePassed(time) {
  const diff = Date.now() - new Date(time).getTime();
  const days = Number.parseInt(diff / (24 * 60 * 60 * 1000));
  const hours = Number.parseInt(diff / 60 / 60 / 1000);
  const mins = Number.parseInt(diff / 60 / 1000);
  const secs = Number.parseInt(diff / 1000);
  if (mins == 0) return secs + "s";
  if (hours == 0) return mins + "m";
  if (days == 0) return hours + "h";
  return days + "d";
}
