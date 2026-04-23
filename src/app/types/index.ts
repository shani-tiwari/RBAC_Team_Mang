// enum --- used for 
// types --- 

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


