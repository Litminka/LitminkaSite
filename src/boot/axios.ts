import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Cookies } from 'quasar';
import NotFoundError from 'src/errors/NotFoundError';
import LoginError from 'src/errors/LoginError';
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

interface ForbiddenError {
    message: string;
}

interface RefreshResponse {
    token: string;
    refreshToken: string;
}

export default boot(({ app, store, ssrContext }) => {
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
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        },
        async function (error: AxiosError) {
            const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies; // otherwise we're on client

            const status = error.response?.status;
            const config = error.response?.config;

            if (status === 422) return error.response;

            if (status === 404) throw new NotFoundError();

            if (status === 401) {
                const refresh = cookies.get('refreshToken');

                if (!refresh) {
                    cookies.remove('token');
                    throw new LoginError();
                }

                const response = await api.get('token/refresh', {
                    headers: {
                        Authorization: `Bearer ${refresh}`,
                    },
                });

                const { token, refreshToken }: RefreshResponse = response.data.data;
                cookies.set('token', token);
                cookies.set('token', refreshToken);
                if (config !== undefined) {
                    config.headers.Authorization = token;
                    return api.request(config);
                }
            }

            if (status === 403) {
                const errorResponse = error.response;

                if (
                    errorResponse &&
                    (<ForbiddenError>errorResponse.data).message == 'no_permissions'
                ) {
                    throw new NotFoundError();
                }

                cookies.remove('token');
                cookies.remove('refreshToken');

                if (config !== undefined) {
                    config.headers.Authorization = undefined;
                    return api.request(config);
                }

                throw new LoginError();
            }

            return Promise.reject(error);
        },
    );

    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
    store.use(() => ({ api }));
});
