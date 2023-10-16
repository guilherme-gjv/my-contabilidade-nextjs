import * as express from "express";
import * as next from "next";
import axios, { AxiosInstance } from "axios";
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
