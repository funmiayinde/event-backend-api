/* eslint-disable @typescript-eslint/no-explicit-any */
import supertest from 'supertest';
import app from '../../../../src/app';
import { CREATED, OK } from '../../../../src/utils/codes';
import { expect } from 'chai';
import { TEST_EVENT_URL, TEST_TOKEN } from '../../routes';
import { getEventObject } from '../../../_seeds/event/event.seed';

let data: any = null;
// Parent block
test('Should test create event', async () => {
  const response = await supertest(await app)
    .post(TEST_EVENT_URL)
    .send({ ...getEventObject() })
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(CREATED);

  data = response.body.data;
  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Object);
  expect(response.body.data).have.property('title');
});

test('Should test get events', async () => {
  const response = await supertest(await app)
    .get(TEST_EVENT_URL)
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(OK);

  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Array);
});

test('Should test get events by customer email', async () => {
  const response = await supertest(await app)
    .get(TEST_EVENT_URL)
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(OK);

  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Array);
  expect(response.body.data[0]).instanceof(Object);
});

test('Should test get event', async () => {
  const response = await supertest(await app)
    .get(`${TEST_EVENT_URL}/${data._id}`)
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(OK);

  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Object);
  expect(response.body.data).have.property('_id');
  expect(response.body.data).have.property('title');
  expect(response.body.data).have.property('category');
  expect(response.body.data).have.property('description');
  expect(response.body.data).have.property('date');
  expect(response.body.data).have.property('isVirtual');
});
