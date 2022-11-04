import axios from "axios";
import { URL_USER_SVC } from "../configs.js"

export const userApi = axios.create({
    baseURL: URL_USER_SVC,
    withCredentials: true
});