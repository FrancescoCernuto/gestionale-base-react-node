// Verifica header x-company-id e lo allega alla request
module.exports = (req, res, next) => {
  const companyId = req.header('x-company-id');
  if (!companyId) return res.status(400).json({ error: 'x-company-id missing' });
  req.companyId = companyId;
  next();
};
