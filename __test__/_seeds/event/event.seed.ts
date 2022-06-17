/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @return {Object} The main object
 **/
export const getEventObject = () => {
  const {faker} = require('@faker-js/faker');
  return {
    title: faker.lorem.sentence(5),
    description: faker.lorem.sentence(),
    category: 'AI',
    address: `${faker.address.streetAddress()} ${faker.address.zipCode()}`,
    date: faker.date.future(),
    isVirtual: false,
  };
};
