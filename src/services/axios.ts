import * as express from "express";
import * as next from "next";
import axios, { AxiosError, AxiosInstance } from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(
  ctx?:
    | Pick<next.NextPageContext, "req">
    | {
        req: next.NextApiRequest;
      }
    | {
        req: express.Request;
      }
    | null
    | undefined
): AxiosInstance {
  const { "mycontabilidade.token": token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "/api",
  });

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return api;
}

export const getErrorFromAPI = (error: AxiosError) => {
  if (error.response?.data) {
    const message = (
      error.response.data as {
        error: string;
      }
    ).error;
    return message;
  }
};
