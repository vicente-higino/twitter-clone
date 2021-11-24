import axios from "axios";
import { config } from "../config";
import { ProfileInfo } from "./ProfileByUsername";

const url = config.url.API;

export class API {
  static getProfileByUsername = (username: string) =>
    axios.get<ProfileInfo>(`${url}/profile/${username}`);

  static getUserProfile = () =>
    axios.get<{ username: string }>(`${url}/profile`);

  static followProfileById = (id: number) =>
    axios.get(`${url}/profile/${id}/follow`);

  static unfollowProfileById = (id: number) =>
    axios.get(`${url}/profile/${id}/unfollow`);

  static logout = () => axios.get(`${url}/logout`);
}
