import axios from "axios";
import { config } from "../config";

const url = config.url.API;

export class API {

    static getProfileByUsername = (username) => axios.get(`${url}/profile/${username}`);

    static getUserProfile = () => axios.get(url + "/profile");

    static followProfileById = (id) => axios.get(`${url}/profile/${id}/follow`);

    static unfollowProfileById = (id) => axios.get(`${url}/profile/${id}/unfollow`);

    static logout = () => axios.get(`${url}/logout`);

}