import BaseError from './BaseError';

export default class NotFoundError extends BaseError {
    constructor() {
        super('/404');
        this.code = 404;
    }
}
