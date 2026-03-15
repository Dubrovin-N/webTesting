import { faker } from '@faker-js/faker';

export const getRandomPassword = () => {
  // Генерируем уникальный пароль, добавляя случайное число и спецсимволы
  return `${faker.internet.password({ length: 12 })}!A1${faker.string.numeric(3)}`;
};

export const createRandomUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  return {
    firstName,
    lastName,
    dob: '1992-12-01',
    address: faker.location.streetAddress(),
    postCode: faker.location.zipCode('#####'),
    city: faker.location.city(),
    state: faker.location.state(),
    country: 'US',
    phone: faker.string.numeric(10),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: faker.internet.password({ length: 15 }) + 'A1!',
  };
};


export const createInvalidUser = () => ({
  ...createRandomUser(),
  email: 'invalid-email-format', 
});