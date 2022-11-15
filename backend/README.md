# EduHope backend server

## Setting up the development environment

1. Refer to `.env.example` and create a `.env` file **with the same format** at the same directory level
as `.env.example`. You can choose specific environment-specific environmental files such as
`.env.development` or `.env.production` depending on your deployment requirements.

Example `.env` file

```js
NODE_ENV=production // or development
```

2. Download and install dependencies (including development ones).
   > **Note:** Run `npm install -g bunyan` to get the bunyan CLI on your PATH
