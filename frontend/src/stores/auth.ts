import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apolloClient } from "@/lib/graphql/apollo";
import type { LoginInput, RegisterInput, User } from "@/types";
import { REGISTER } from "@/lib/graphql/mutations/Register";
import { LOGIN } from "@/lib/graphql/mutations/Login";
import { ME } from "@/lib/graphql/queries/Me";

type RegisterMutationData = {
  register: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type LoginMutationData = {
  login: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signup: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  hydrateUser: () => Promise<void>;
  setUserName: (fullname: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (loginData: LoginInput) => {
        const { data } = await apolloClient.mutate<
          LoginMutationData,
          { data: LoginInput }
        >({
          mutation: LOGIN,
          variables: {
            data: {
              email: loginData.email,
              password: loginData.password,
            },
          },
        });

        if (!data?.login) return false;

        const { user, token } = data.login;

        set({
          user,
          token,
          isAuthenticated: true,
        });

        return true;
      },
      signup: async (registerData: RegisterInput) => {
        const { data } = await apolloClient.mutate<
          RegisterMutationData,
          { data: RegisterInput }
        >({
          mutation: REGISTER,
          variables: {
            data: {
              fullname: registerData.fullname,
              email: registerData.email,
              password: registerData.password,
            },
          },
        });

        if (!data?.register) return false;

        const { token, user } = data.register;

        set({
          user,
          token,
          isAuthenticated: true,
        });

        return true;
      },
      hydrateUser: async () => {
        const { token, isAuthenticated } = get();
        if (!token || !isAuthenticated) return;

        try {
          const { data } = await apolloClient.query<{ me: User }>({
            query: ME,
            fetchPolicy: "network-only",
          });

          if (data?.me) {
            set({ user: data.me, isAuthenticated: true });
          }
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
      setUserName: (fullname: string) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, fullname } });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        void apolloClient.clearStore();
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
