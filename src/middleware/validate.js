export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errors 
        });
      }
      
      req.body = result.data;
      next();
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({ 
          error: 'Invalid query parameters', 
          details: errors 
        });
      }
      
      req.query = result.data;
      next();
    } catch (error) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }
  };
};

export default { validate, validateQuery };
