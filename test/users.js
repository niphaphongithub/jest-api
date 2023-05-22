import { expect } from "chai";
import request from "../config/common";
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const TOKEN = process.env.USER_TOKEN;

  describe('Users', () => {
    let userId;
  
    describe('POST', () => {
      it('/users', () => {
        const data = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          gender: 'male',
          status: 'active',
        };
  
        return request
          .post('users')
          .set('Authorization', `Bearer ${TOKEN}`)
          .send(data)
          .then((res) => {
            console.log(res.body.data)
            expect(res.body.data).to.deep.include(data);
            userId = res.body.data.id;
          });
      });
    });
  
    describe('GET', () => {
      it('/users', () => {
        return request.get(`users?access-token=${TOKEN}`).then((res) => {
          expect(res.body.data).to.not.be.empty;
        });
      });
  
      it('/users/:id', () => {
        return request
          .get(`users/${userId}?access-token=${TOKEN}`)
          .then((res) => {
            expect(res.body.data.id).to.be.eq(userId);
          });
      });
  
      it('/users with query params', () => {
        const url = `users?access-token=${TOKEN}&page=5&gender=female&status=active`;
  
        return request.get(url).then((res) => {
          expect(res.body.data).to.not.be.empty;
          res.body.data.forEach((data) => {
            expect(data.gender).to.eq('female');
            expect(data.status).to.eq('active');
          });
        });
      });
    });
  
    describe('PUT', () => {
      it('/users/:id', () => {
        const data = {
          status: 'active',
          name: faker.internet.email(),
        };
  
        return request
          .put(`users/${userId}`)
          .set('Authorization', `Bearer ${TOKEN}`)
          .send(data)
          .then((res) => {
            expect(res.body.data).to.deep.include(data);
          });
      });
    });
  
    describe('DELETE', () => {
      it('/users/:id', () => {
        return request
          .delete(`users/${userId}`)
          .set('Authorization', `Bearer ${TOKEN}`)
          .then((res) => {
            expect(res.body.data).to.be.eq(null);
          });
      });
    });

    describe('Negative Tests', () => {
        it('422 Data validation failed', async () => {
          const data = {};
    
          const res = await request
            .post(`posts`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(data);
    
          expect(res.body.code).to.eq(422);
          expect(res.body.data[2].message).to.eq("can't be blank");
        });
    
        it('401 Authentication failed', async () => {
          const data = {
            email: faker.internet.email(),
            name: 'Test name',
            gender: 'male',
            status: 'active',
          };
    
          const res = await request.post(`posts`).send(data);
    
          expect(res.body.code).to.eq(401);
          expect(res.body.data.message).to.eq('Authentication failed');
        });
      });
      
  });