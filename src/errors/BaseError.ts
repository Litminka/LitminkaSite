interface Base {
    redirect: string;
    code: number;
}

export default class BaseError extends Error implements Base {
    redirect: string;
    code: number = 0;

    constructor(redirect: string) {
        super();
        this.redirect = redirect;
    }
}
