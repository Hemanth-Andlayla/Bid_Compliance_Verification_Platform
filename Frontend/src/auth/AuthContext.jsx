
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef
} from 'react';

import keycloak from './keycloak';
import { ROLES, ROLE_HOME_ROUTES } from '../utils/constants';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const [user, setUser] =
        useState(null);

    const [token, setToken] =
        useState(null);

    const [roles, setRoles] =
        useState([]);

    const [primaryRole, setPrimaryRole] =
        useState(null);

    const initRef =
        useRef(false);


    // --------------------------------------------------
    // Extract roles from Keycloak token
    // --------------------------------------------------

    const extractRoles = useCallback((tokenParsed) => {

        const realmRoles =
            tokenParsed?.realm_access?.roles || [];

        const clientRoles =
            tokenParsed
                ?.resource_access?.[
                    import.meta.env.VITE_KEYCLOAK_CLIENT_ID ||
                    'bid-compliance-frontend'
                ]?.roles || [];

        const allRoles = [
            ...new Set([
                ...realmRoles,
                ...clientRoles
            ])
        ];


        let primary = null;

        if (allRoles.includes(ROLES.ADMIN)) {

            primary = ROLES.ADMIN;

        } else if (allRoles.includes(ROLES.OFFICER)) {

            primary = ROLES.OFFICER;

        } else if (allRoles.includes(ROLES.BIDDER)) {

            primary = ROLES.BIDDER;
        }


        return {
            allRoles,
            primary
        };

    }, []);


    // --------------------------------------------------
    // Load current application user from backend
    // --------------------------------------------------

    const loadCurrentUser = useCallback(async () => {

        /*
         * axiosClient already returns response.data
         * from its response interceptor.
         *
         * Therefore we must NOT use response.data here.
         */
        const applicationUser =
            await axiosClient.get('/users/me');

        return applicationUser;

    }, []);


    // --------------------------------------------------
    // Update authentication state
    // --------------------------------------------------

    const updateAuthState = useCallback(
        async (authenticated) => {

            if (
                authenticated &&
                keycloak.token
            ) {

                setToken(keycloak.token);
                setIsAuthenticated(true);


                // Roles come from Keycloak
                const tokenParsed =
                    keycloak.tokenParsed || {};

                const {
                    allRoles,
                    primary
                } = extractRoles(tokenParsed);

                setRoles(allRoles);
                setPrimaryRole(primary);


                // Application profile comes from MySQL
                try {

                    const applicationUser =
                        await loadCurrentUser();

                    setUser({
                        id: applicationUser.id,
                        name: applicationUser.name,
                        email: applicationUser.email,
                        organization:
                            applicationUser.organization
                    });

                } catch (error) {

                    console.error(
                        'Failed to load application user:',
                        error
                    );

                    setUser(null);

                }

            } else {

                setIsAuthenticated(false);
                setToken(null);
                setUser(null);
                setRoles([]);
                setPrimaryRole(null);
            }

            setIsLoading(false);

        },
        [
            extractRoles,
            loadCurrentUser
        ]
    );


    // --------------------------------------------------
    // Keycloak initialization
    // --------------------------------------------------

    useEffect(() => {

        if (initRef.current) {
            return;
        }

        initRef.current = true;


        keycloak
            .init({
                onLoad: 'check-sso',
                checkLoginIframe: false,
                pkceMethod: 'S256',
                enableLogging: false,
            })

            .then(async (authenticated) => {

                await updateAuthState(
                    authenticated
                );


                // Token auto-refresh
                if (authenticated) {

                    keycloak.onTokenExpired = () => {

                        keycloak
                            .updateToken(70)

                            .then((refreshed) => {

                                if (refreshed) {

                                    setToken(
                                        keycloak.token
                                    );

                                }

                            })

                            .catch(() => {

                                updateAuthState(false);

                            });

                    };

                }

            })

            .catch((error) => {

                console.error(
                    'Keycloak initialization error:',
                    error
                );

                setIsAuthenticated(false);
                setIsLoading(false);

            });

    }, [updateAuthState]);


    // --------------------------------------------------
    // Login
    // --------------------------------------------------

    const login = useCallback(
        (options = {}) => {

            return keycloak.login({
                redirectUri:
                    options.redirectUri ||
                    window.location.origin,

                ...options,
            });

        },
        []
    );


    // --------------------------------------------------
    // Logout
    // --------------------------------------------------

    const logout = useCallback(
        (options = {}) => {

            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            setRoles([]);
            setPrimaryRole(null);

            return keycloak.logout({
                redirectUri:
                    options.redirectUri ||
                    window.location.origin,

                ...options,
            });

        },
        []
    );


    // --------------------------------------------------
    // Role check
    // --------------------------------------------------

    const hasRole = useCallback(
        (role) => {

            if (!role) {
                return true;
            }

            return roles.includes(role);

        },
        [roles]
    );


    // --------------------------------------------------
    // Dashboard route
    // --------------------------------------------------

    const getDashboardRoute = useCallback(() => {

        if (
            primaryRole &&
            ROLE_HOME_ROUTES[primaryRole]
        ) {

            return ROLE_HOME_ROUTES[primaryRole];
        }

        return '/';

    }, [primaryRole]);


    const value = {

        isAuthenticated,
        isLoading,

        // Application profile from MySQL
        user,

        // Keycloak authentication token
        token,

        // Keycloak authorization roles
        roles,
        primaryRole,

        login,
        logout,
        hasRole,
        getDashboardRoute,
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            'useAuth must be used within an AuthProvider'
        );
    }

    return context;
}
