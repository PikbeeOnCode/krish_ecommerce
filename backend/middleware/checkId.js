const checkId = (req, res, next) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
        res.status(404);
        throw new Error(`Invalid id: ${req.params.id}`);
    }
    next();
};

export default checkId;