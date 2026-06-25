export function notFound(req,res,next){ res.status(404).json({success:false,message:`Ruta no encontrada: ${req.originalUrl}`}); }
export function errorHandler(err,req,res,next){ console.error(err); res.status(err.status||500).json({success:false,message:err.message||'Error interno'}); }
