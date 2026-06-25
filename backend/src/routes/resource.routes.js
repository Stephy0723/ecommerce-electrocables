import { Router } from 'express';
import { crudController } from '../controllers/base.controller.js';
import { requireAuth, allowRoles } from '../middlewares/auth.middleware.js';
export function makeCrudRouter(resource){
  const router=Router(); const c=crudController(resource);
  router.get('/',c.list); router.get('/:id',c.get);
  router.post('/',requireAuth,allowRoles('admin','vendedor','inventario','cajero'),c.create);
  router.put('/:id',requireAuth,allowRoles('admin','vendedor','inventario','cajero'),c.update);
  router.delete('/:id',requireAuth,allowRoles('admin'),c.remove);
  return router;
}
