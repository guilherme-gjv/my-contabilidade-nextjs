import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown | Error | AxiosError) => {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      const message = (
        error.response.data as {
          error: string;
        }
      ).error;
      return message;
    } else {
      return error.message;
    }
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "Erro desconhecido.";
  }
};
