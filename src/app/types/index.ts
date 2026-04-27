import { User } from "@prisma/client";



export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER",
    GUEST = "GUEST"
};

export interface user{
    id: string,
    name: string,
    email: string,
    role: Role,
    team?: Team,
    teamId?: string,
    createdAt: Date,
    updatedAt: Date
}

export interface Team{
    id: string,
    name: string,
    members: user[],
    code: string,
    description?: string | null,
    createdAt: Date,
    updatedAt: Date
} 


export type LoginState = {
    success?: boolean;
    user?: User | null;
    error?: string;
};

export type RegisterState = {
    success?: boolean;
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

