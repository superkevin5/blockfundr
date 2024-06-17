import React, {createContext, useContext, useState} from 'react';
import {AuthContextType, User} from "@/types";



// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component

interface MyComponentProps {
    children: React.ReactNode;
    // Define other props here
}

export const AuthProvider: React.FC<MyComponentProps> = ({children}) => {
    const [user, setUser] = useState<User>({
        name: "",
        username: "",
        userId: "",
        // Optionally, initialize the role property if it's part of your user object
        role: ""
    });


    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
