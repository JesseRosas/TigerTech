export const requireHRorAdmin = (req, res, next) => {
    if (req.user.role !== "hr" && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
    }
    next();
};