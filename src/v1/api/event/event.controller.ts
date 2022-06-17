
import { AppModel } from '../_core';
import { AppController } from '../_core/app.controller';
import { Event } from './event.model';

/**
 * The EventController
 * */
export class EventController extends AppController{

  /**
   * @param {AppModel} model
   */
  constructor(model: AppModel<Event>) {
    super(model);
  }

}

export default EventController;
