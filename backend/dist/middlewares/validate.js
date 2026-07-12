"use strict";
// ============================================================
// EcoSphere — Zod Validation Middleware
// Validates request body, params, or query against Zod schemas
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
/**
 * Creates middleware that validates request data against a Zod schema
 */
function validate(schema, target = 'body') {
    return (req, _res, next) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            return next(result.error);
        }
        // Replace request data with parsed (and transformed) data
        req[target] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map