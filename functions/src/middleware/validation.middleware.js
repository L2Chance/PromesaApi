function validateFields(requiredFields) {
  return (req, res, next) => {
    const data = req.body || req.query || req.params;
    const missing = requiredFields.filter(field => !(field in data) || data[field] === undefined || data[field] === '');
    if (missing.length > 0) {
      return res.status(400).json({ error: `Faltan los siguientes campos requeridos: ${missing.join(', ')}` });
    }
    next();
  };
}

module.exports = validateFields;
