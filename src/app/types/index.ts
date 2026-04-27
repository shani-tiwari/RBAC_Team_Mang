import { Role, User } from "@prisma/client";

export type LoginState = {
    success?: boolean;
    user?: User | null;
    error?: string;
};

export interface AuthContextType {
    user: User | null;
    login: (payload: FormData) => void;
    logout: () => Promise<void>;
    hasPermission: (requiredRole: Role) => boolean;
    isPending: boolean;
    loginState: LoginState;
}