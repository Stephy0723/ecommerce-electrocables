export function requireAuth(req,res,next){
  // Futuro: validar JWT/session.
  req.user = { id:'usr-001', role:'admin' };
  next();
}
export function allowRoles(...roles){ return (req,res,next)=> roles.includes(req.user?.role) ? next() : res.status(403).json({success:false,message:'No autorizado'}); }
