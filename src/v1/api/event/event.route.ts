
import { Router } from 'express';
import { EventController } from './event.controller';
import { EventModel } from './event.model';

const router = Router();

const ctrl = new EventController(EventModel);

router.route('/events').post(ctrl.create).get(ctrl.find);

router.param('id', ctrl.id);
router
  .route('/events/:id')
  .get(ctrl.findOne);

export default router;
