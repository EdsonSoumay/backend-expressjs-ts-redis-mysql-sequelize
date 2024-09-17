import supertest from 'supertest';
import sequelize from './setupTests';
import createServer from '../helpers/server';
import User from '../db/models/User';

const app = createServer();

const user1 = { username: 'user1', email: 'user1@gmail.com', password: '123' };

beforeAll(async () => {
  console.log('Syncing database...');
  await sequelize.sync({ force: true }); // This will create the tables
  console.log('Database synced.');
});

afterAll(async () => {
  console.log('Closing database connection...');
  await sequelize.close();
  console.log('Database connection closed.');
});

beforeEach(async () => {
  console.log('Clearing user table before each test...');
  await User.destroy({ where: {} }); // Ensure all records are cleared
  console.log('User table cleared.');
});

describe('Auth Controller', () => {
  describe('register', () => {
    it('should return 201', async () => {
      const response = await supertest(app).post('/api/auth/register').send(user1);
      expect(response.status).toBe(201);
    });
  });
});
