// src/lib/api.ts

import axios from "axios";
import { Configuration } from "@/api/configuration";
import {
  ProjectApi,
  GeometryApi,
  AttentionPointApi,
  PointToSecureApi,
  SafetyEquipmentApi,
  SafetyEquipmentTypeApi,
  MemberApi,
  UserApi,
  TeamApi,
  MapApi,
  ActionApi,
  AppApi, TransferApi, LengthApi,
} from "@/api";

/**
 * 1. Global Axios instance
 */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HTTP_API_URL as string,
  timeout: 5000,
  withCredentials: true,
});

/**
 * 2. OpenAPI configuration
 * basePath est déjà porté par axios.baseURL → inutile de le dupliquer ici
 */
const configuration = new Configuration({
});

/**
 * 3. API clients
 */
const projectApi = new ProjectApi(configuration, undefined, axiosInstance);
const geometryApi = new GeometryApi(configuration, undefined, axiosInstance);
const attentionPointApi = new AttentionPointApi(configuration, undefined, axiosInstance);
const pointToSecureApi = new PointToSecureApi(configuration, undefined, axiosInstance);
const safetyEquipmentApi = new SafetyEquipmentApi(configuration, undefined, axiosInstance);
const safetyEquipmentTypeApi = new SafetyEquipmentTypeApi(configuration, undefined, axiosInstance);
const memberApi = new MemberApi(configuration, undefined, axiosInstance);
const userApi = new UserApi(configuration, undefined, axiosInstance);
const teamApi = new TeamApi(configuration, undefined, axiosInstance);
const mapApi = new MapApi(configuration, undefined, axiosInstance);
const actionApi = new ActionApi(configuration, undefined, axiosInstance);
const appApi = new AppApi(configuration, undefined, axiosInstance);
const transferApi = new TransferApi(configuration, undefined, axiosInstance);
const lengthApi = new LengthApi(configuration, undefined, axiosInstance);

/**
 * 4. Export API container
 */
export const api = {
  project: projectApi,
  app: appApi,
  geometry: geometryApi,
  attentionPoint: attentionPointApi,
  pointToSecure: pointToSecureApi,
  safetyEquipment: safetyEquipmentApi,
  safetyEquipmentType: safetyEquipmentTypeApi,
  member: memberApi,
  user: userApi,
  team: teamApi,
  map: mapApi,
  action: actionApi,
  transfer: transferApi,
  length: lengthApi,
};
