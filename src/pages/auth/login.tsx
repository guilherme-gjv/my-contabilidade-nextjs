import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

import { useCallback, useContext, useEffect } from "react";

const Login: React.FC = () => {
  const { push } = useRouter();
  const { signIn } = useContext(AuthContext);

  const handleLogin = useCallback(async () => {
    console.log("logando");

    await signIn({ email: "guigui@email.com", password: "12345678" });
    console.log("logou");

    push("/");
  }, [signIn, push]);

  //* render
  return (
    <main>
      <button onClick={handleLogin}>Logar</button>
    </main>
  );
};

export default Login;
