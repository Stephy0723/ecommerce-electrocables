import { db } from '../utils/mockStore.js';
export function crudController(resource){
  return {
    list:(req,res)=>res.json({success:true,data:db[resource]||[]}),
    get:(req,res)=>res.json({success:true,data:(db[resource]||[]).find(x=>x.id===req.params.id)||null}),
    create:(req,res)=>{const item={id:`${resource}-${Date.now()}`,...req.body}; db[resource].unshift(item); res.status(201).json({success:true,data:item});},
    update:(req,res)=>{db[resource]=db[resource].map(x=>x.id===req.params.id?{...x,...req.body}:x); res.json({success:true,data:db[resource].find(x=>x.id===req.params.id)});},
    remove:(req,res)=>{db[resource]=db[resource].filter(x=>x.id!==req.params.id); res.json({success:true,message:'Eliminado'});}
  }
}
