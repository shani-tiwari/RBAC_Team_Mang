//  Helper functions for authentication process 

import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import { cookies } from 'next/headers';
import { prisma } from '../db';
import { Role, User } from '@prisma/client';

// for creating hash of password 
export const hashPassWord = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

// for comparing password with hash password 
export const verifyPassword = async (password: string, hashPassWord: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashPassWord);
    return isMatch;
};


// for creating jwt token 
export const createToken = async (userId: string): Promise<string> => {
    return jwt.sign({userId}, process.env.JWT_SECRET!, { expiresIn: '1h' });
};


//  verify token
export const verifyToken = async (token: string): Promise<{userId: string}> => {
    return jwt.verify(token, process.env.JWT_SECRET!) as {userId: string};
}; 


//  get current user
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        const decoded = await verifyToken(token as string);

        if(!token) return null;

        const userFromDB = await prisma.user.findUnique({
            where: {id: decoded.userId}
        });
        if(!userFromDB) return null;
        // return userFromDB;
            //    we will send only the required details not all of them
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password, ...user} = userFromDB;
        return user as User;
    } catch(e) {
        console.log("error occur at getting user" + e);
        return null;
    }
};


//  check user permission 
export const checkUserPermission = ( user: User , requiredRole: Role): boolean => {
    const roleHierarchy = {
        [Role.GUEST]   : 0,
        [Role.USER]    : 1,
        [Role.MANAGER] : 2,
        [Role.ADMIN]   : 3,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    
    // const userRoleWeight = roleHierarchy[user.role];
    // const requiredRoleWeight = roleHierarchy[requiredRole];
    
    // // check 
    // if(userRoleWeight <= requiredRoleWeight) return true;
    // return false;
}