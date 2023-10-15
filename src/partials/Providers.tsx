import { AuthProvider } from "../contexts/AuthContext";

const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
