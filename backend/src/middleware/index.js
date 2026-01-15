module.exports = {
    ...require('./auth.middleware'),
    ...require('./error.middleware'),
    ...require('./validate.middleware')
};
