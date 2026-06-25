export const ok=(res,data,message='OK')=>res.json({success:true,message,data});
export const created=(res,data,message='Creado')=>res.status(201).json({success:true,message,data});
