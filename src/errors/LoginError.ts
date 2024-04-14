import BaseError from './BaseError';

export default class LoginError extends BaseError {
    constructor() {
        super('/login');
        this.code = 200;
    }
}
