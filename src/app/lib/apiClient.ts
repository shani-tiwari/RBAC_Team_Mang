const base_api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient{
    private baseUrl: string;
    
    constructor() {
        this.baseUrl = base_api;
    };

    /**
     * Generic request method for api calling
     * @template T
     * @param {string} endpoint
     * @param {RequestInit} options
     * @returns {Promise<T>}
     */
    async request (endpoint: string, options: RequestInit = {}) {
        try {
            const url = `${this.baseUrl}/${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",  // ! important for including cookies
            ...options,
        };

        const res = await fetch(url, defaultOptions);
        // handle response status code - 401, 403
        if(res.status === 401 || res.status === 403) {
            // redirect to login
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        if(!res.ok) {
            throw new Error(`API error: ${res.statusText}`);
        }
        
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data?.message || `API error: ${res.statusText}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
    }

//  auth methods
    // GET REQUEST
    async register(data: Record<string, unknown>) {
        return this.request("auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    // login request
    async login(email: string, password: string) {
        return this.request("auth/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
        });
    }
    
    // logout request
    async logout() {
        return this.request("auth/logout", {
            method: "POST",
        }); 
    };

    //  me 
    async getCurrentUser() {
        return this.request("auth/me", {
            method: "GET",
        });
    }; 

//  user methods
    // get users
    async getUsers() {
        return this.request("user", {
            method: "GET",
        });
    } 
//  admin methods
    // update user role
    async updateUserRole(id: string, role: string) {
        return this.request(`user/${id}/role`, {
            method: "PATCH",
            body: JSON.stringify({role}),
        });
    }

    // update user role
    async assignUserToTeam(id: string, teamId: string | null) {
        return this.request(`user/${id}/team`, {
            method: "PATCH",
            body: JSON.stringify({teamId}),
        });
    }
}

export const apiClient = new ApiClient();