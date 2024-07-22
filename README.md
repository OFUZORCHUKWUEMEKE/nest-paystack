<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Built with <a href="http://nestjs.com" target="_blank">Nestjs </a>and  <a href="http://paystack.com" target="_blank">Paystack</a></p>

   

## Introduction
A NestJS API that incorporates Paystack payment processing and includes wallet functionality

This api was developed using

* NodeJs (LTS version 21.5.0)
* Nestjs
* Mongoose 
* MongoDB

The tools listed below are needed to run this application to run effectively:

Node (LTS Version)
Nest (LTS Version)

You can check the Node.js and npm versions by running the following commands.

Check node.js version
```typescript
   node -v
```
Check npm version
```typescript
   npm -v
```

| Method       | Description              | Endpoints                              |
|--------------|--------------------------|----------------------------------------|
| POST         | Signup                   | /api/signup                            |
| POST         | Login                    | /api/login                             |
| POST         | Create Customer          | /api/customers                         |
| POST         | Create Paystack Customer | /api/paystack                          |
| GET          | Fetch Bank List          | /api/paystack/bank-list                |
| GET          | Resolve Bank Account     | /api/paystack/resolve-account-number   |
| POST         | Create Beneficiary       | /api/paystack/transfer-recipient       |
| POST         | Bank Transfer            | /api/paystack/transfer                 |
| POST         | Wallet Transfer          | /api/wallets/transfer                  |
| GET          | Get Transactions         | /api/transactions                      |



- LinkedIn - [Connect LinkedIn](https://www.linkedin.com/in/ofuzor-chukwuemeke-648186204/)
- Twitter - [@OfuzorEmeke](https://twitter.com/OfuzorEmeke)
