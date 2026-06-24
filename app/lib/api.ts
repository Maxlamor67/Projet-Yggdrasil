import { Configuration, TransferApi } from "../api";
import axios from "axios";
import {getSoftwareBaseUrl} from "../contexts/SoftwareProvider";

export const axiosInstance = axios.create({
  timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
  const baseUrl = getSoftwareBaseUrl();
  if (baseUrl) {
    config.baseURL = baseUrl;
  }
  return config;
});


const configuration = new Configuration({
  basePath: '',
});

const transferApi = new TransferApi(configuration, undefined, axiosInstance);

export const api = {
  transfer: transferApi,
};
