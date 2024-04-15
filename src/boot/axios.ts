import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Cookies } from 'quasar';
import NotFoundError from 'src/errors/NotFoundError';
import LoginError from 'src/errors/LoginError';
import { useUserStore } from 'src/stores/user-store';
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $api: AxiosInstance;
    }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

enum UnauthorizedTypes {
    Unauthorized = 'unauthorized',
    NotProvided = 'not_provided',
    Expired = 'expired',
    RefreshExpired = 'refresh_expired',
}

interface UnauthorizedError {
    message: UnauthorizedTypes;
}

interface RefreshResponse {
    token: string;
    refreshToken: string;
}

export default boot(({ store, ssrContext }) => {
    if (process.env.DEV) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    const api = axios.create({ baseURL: 'https://api.litminka.ru' });

    api.interceptors.request.use(
        function (config) {
            const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies; // otherwise we're on client
            const token = cookies.get('token');

            if (!token) return config;

            config.headers.concat({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            });

            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error);
        },
    );

    api.interceptors.response.use(
        function (response) {
            return response;
        },
        async function (error: AxiosError) {
            const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies;

            const response = error.response;
            const status = error.response?.status;
            const config = error.response?.config;

            if (status === 422) return response;

            if (status === 403 || status === 404) throw new NotFoundError();

            if (status === 401) {
                const userStore = useUserStore(store);
                const refresh = cookies.get('refreshToken');
                // if 401 and token anything but expired, end the session
                if (
                    response === undefined ||
                    (<UnauthorizedError>response.data).message !== UnauthorizedTypes.Expired ||
                    !refresh
                ) {
                    userStore.signOut(cookies);
                    throw new LoginError();
                }

                const res = await api.get('token/refresh', {
                    headers: {
                        Authorization: `Bearer ${refresh}`,
                    },
                });

                const { token, refreshToken }: RefreshResponse = res.data.body;

                cookies.set('token', token);
                cookies.set('refreshToken', refreshToken);

                // retry original request
                if (config !== undefined) {
                    config.headers.Authorization = token;
                    return api.request(config);
                }
            }

            return Promise.reject(error);
        },
    );

    store.use(() => ({ api, axios }));
});
