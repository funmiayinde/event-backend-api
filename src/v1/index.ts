import { Router } from 'express';


import event from './api/event/event.route';

const router: Router = Router();

router.use(event);

export default router;
