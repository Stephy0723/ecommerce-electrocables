import { Router } from 'express';
import authRoutes from './auth.routes.js';
import { makeCrudRouter } from './resource.routes.js';
const router=Router();
router.use('/auth',authRoutes);
['users','clients','products','categories','providers','inventory','orders','payments','cashbox','incomes','expenses','reports','logs','settings'].forEach(r=>router.use(`/${r}`,makeCrudRouter(r)));
export default router;
