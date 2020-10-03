module.exports = (req, res, next) => {
    req.pagination = {
        limit: +req.query.limit || 10,
        offset: +req.query.offset || 0,
    };
    next();
}