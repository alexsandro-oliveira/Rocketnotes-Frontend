// Importando Hooks do react, context, state, effect.
import { createContext, useContext, useEffect, useState } from "react";
//  Importando API para utilizar na função de SignIn
import { api } from "../services/api";

// Criando o contexto de autenticação.
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState({}); // estado que vai guardar os dados do usuário e o token de autenticação.

  // Função que vai fazer o post no endpoint /sessions da API.
  async function signIn({ email, password }) {
    try {
      const response = await api.post("/sessions", { email, password });
      const { user, token } = response.data;

      // Salvando os dados no local storage.
      localStorage.setItem("@rocketnotes:user", JSON.stringify(user)); // user é um objeto, aqui o JSON.strigify formata para um texto.
      localStorage.setItem("@rocketnotes:token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setData({ user, token }); // função do useState guardando, dentro da variável "data" as informações.
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível entrar.");
      }
    }
  }

  function signOut() {
    localStorage.removeItem("@rocketnotes:token");
    localStorage.removeItem("@rocketnotes:user");

    setData({});
  }

  async function updateProfile({ user, avatarFile }) {
    try {
      if (avatarFile) {
        const fileUploadForm = new FormData();
        fileUploadForm.append("avatar", avatarFile);

        const response = await api.patch("/users/avatar", fileUploadForm);
        user.avatar = response.data.avatar;
      }

      // Remove a senha do objeto "user"
      const { password, ...userData } = user;

      await api.put("/users", userData);

      // Armazena o objeto "userData" sem a senha no localStorage
      localStorage.setItem("@rocketnotes:user", JSON.stringify(userData));

      setData({ user: userData, token: data.token });

      alert("Perfil atualizado");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível atualizar o perfil.");
      }
    }
  }

  // PEGANDO os dados salvos no localStorage
  useEffect(() => {
    const token = localStorage.getItem("@rocketnotes:token");
    const user = localStorage.getItem("@rocketnotes:user");

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // preenchimento do estado "data", dessa vez, com os dados que estavam salvos no localStorage.
      setData({
        token,
        user: JSON.parse(user), // voltando o user para um objeto JSON, depois de ter transformado em string lá em cima.
      });
    }
  }, []);

  return (
    <AuthContext.Provider // aqui tá devolvendo o provider, que encapsulára as rotas da aplicação, lá no main.jsx.
      value={{
        signIn,
        signOut,
        updateProfile,
        user: data.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
