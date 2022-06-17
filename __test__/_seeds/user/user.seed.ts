/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @return {Object} The main object
 **/
export const getNameObject = () => {
  const { faker } = require('@faker-js/faker');
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
  };
};
