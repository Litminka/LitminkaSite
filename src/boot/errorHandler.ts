import { boot } from 'quasar/wrappers';
import BaseError from 'src/errors/BaseError';
import LoginError from 'src/errors/LoginError';
import NotFoundError from 'src/errors/NotFoundError';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, redirect }) => {
    app.config.errorHandler = function (err) {
        if (err instanceof BaseError) {
            if (err instanceof LoginError) {
                return redirect(err.redirect);
            }

            if (err instanceof NotFoundError) {
                return redirect(err.redirect);
            }
        }
        console.error(err);
    };
});
