import { api } from "@/services/api";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { ReactNode, createContext, useEffect, useState } from "react";

interface UserData {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface IAuthContext {
  isAuthenticated: boolean | null;
  user: UserData | null;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface ILoginResponseData {
  message?: string;
  data?: {
    token: string;
    user: UserData;
  };
  error?: string;
}

export const AuthContext = createContext({} as IAuthContext);

const paths = { auth: { login: "/auth/login", signup: "/auth/cadastrar" } };

export function AuthProvider({ children }: AuthProviderProps) {
  const { push, asPath } = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const signIn = async ({ email, password }: SignInData) => {
    const result = await api.post<ILoginResponseData>("/auth/login", {
      email,
      password,
    });

    const token = result.data.data?.token;
    const user = result.data.data?.user;

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setCookie(undefined, "mycontabilidade.token", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    if (user) {
      setUser(user);
      setCookie(undefined, "mycontabilidade.user_id", user.id.toString(), {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    push("/");
  };

  const signOut = () => {
    try {
      destroyCookie(undefined, "mycontabilidade.token", { path: "/" });
      destroyCookie(undefined, "mycontabilidade.user_id", { path: "/" });
      api.defaults.headers.Authorization = "";
      setUser(null);
      setIsAuthenticated(false);
      push("/auth/login");
    } catch (error) {
      console.log("Erro: ");
      console.log(error);
    }
  };

  useEffect(() => {
    const setUserFromApi = async (userId: string) => {
      const result = await api.get<UserData>("/user/" + userId);
      if (result.status === 200) {
        setUser(result.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    const { "mycontabilidade.token": token } = parseCookies();
    const { "mycontabilidade.user_id": userId } = parseCookies();

    if (token != "undefined" && userId != "undefined" && token && userId) {
      setUserFromApi(userId);
    } else {
      setIsAuthenticated(false);
      if (!Object.values(paths.auth).includes(asPath)) {
        push(paths.auth.login);
      }
    }
  }, [asPath, push]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
