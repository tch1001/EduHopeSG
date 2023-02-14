# First-time setups

## Setting up the development environment

1. **Recommend** that node.js version is the current LTS version [v18.12.1](<https://nodejs.org/en/>)
for best compatibility and the least amount of bugs as it is written and tested in this version

2. Download and install code and dependencies (including development ones).
    ```
    git clone <this-repo>
    npm install
    npm audit fix --force
    ```

3. Refer to `.env.example` and create a `.env` file **with the same format** at the same directory level
as `.env.example`

4. Then `npm run` to run

## Setting up for production environment

1. Ensure that the `.env` file is correctly configured

2. Build the Next.js application
    ```
    npm test
    npm run build
    ```

3. `npm run start` to start serving the application