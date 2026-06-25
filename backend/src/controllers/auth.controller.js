export const login=(req,res)=>res.json({success:true,message:'Login preparado. Implementar JWT luego.',token:'mock-token',user:{role:'admin'}});
export const register=(req,res)=>res.status(201).json({success:true,message:'Registro preparado',data:req.body});
export const me=(req,res)=>res.json({success:true,user:req.user});
