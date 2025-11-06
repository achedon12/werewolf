# Werewolf Game

A real-time Werewolf game built with Next.js, React, and Node.js, leveraging Docker for containerization.

## Key Features & Benefits

- **Real-time Gameplay:** Experience dynamic and engaging Werewolf sessions.
- **Modern Technology Stack:** Built with Next.js, React, and Node.js for optimal performance and scalability.
- **Dockerized Deployment:** Easily deploy and manage the application using Docker.
- **User Authentication and Profiles:** Secure user accounts with profile history.
- **Customizable Roles:** Flexible role assignments and configurations.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Node.js:** Version 20 or higher
- **npm:**  Included with Node.js
- **Docker:**  For containerization
- **Docker Compose:**  For multi-container Docker applications
- **Prisma CLI:**  For database management

## Installation & Setup Instructions

Follow these steps to get the Werewolf game up and running:

1. **Clone the repository:**

   ```bash
   git clone git@github.com:achedon12/werewolf.git
   cd werewolf
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory from the provided `.env.example` file and configure the necessary
   environment variables:

   ```
   DATABASE_URL="your_database_connection_string"
   JWT_SECRET="your_jwt_secret"
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database (optional):**

   ```bash
   npm run seed
   ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

7. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`.

## Docker Setup

1. **Build the Docker image for production:**

   ```bash
   docker compose up --build -d
   ```

   > For each code change, rebuild the Docker image using the above command.

2. **Access the application:**

   > Open your browser and navigate to `http://localhost:82`.

## Usage Examples & API Documentation

### API Endpoints

- **`GET /api/auth/profile/history`**: Retrieves the user's profile history. Requires a valid JWT token in the
  `Authorization` header (`Bearer <token>`).

  ```javascript
  // Example usage in React:
  async function fetchHistory() {
      const token = localStorage.getItem('jwt_token'); // Example: Retrieve token from local storage
      const response = await fetch('/api/auth/profile/history', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          const data = await response.json();
          console.log('History data:', data);
      } else {
          console.error('Error fetching history:', response.statusText);
      }
  }
  ```

### Code Snippets

**prisma/seed.js**

```javascript
import {PrismaClient} from '../src/generated/prisma/index.js';
import {roles} from '../src/utils/Roles.js';

const prisma = new PrismaClient();

const randomDateBetween = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const main = async () => {
    const achedonId = 'cmgfbery3e400s3l9oqmsx';
    const achedon = await prisma.user.findUnique({
        where: {id: achedonId}
    });

    const createdUsers = [];
    for (let i = 1; i <= 100; i++) {
        const user = await prisma.user.create({
            data: {
                username: `user${i}`,
                email: `test${i}@test.com`,
                password: 'hashed_password', // Replace with actual hashed password
            }
        });
        createdUsers.push(user);
    }
```

## Configuration Options

- **Environment Variables:**

    - `DATABASE_URL`: Connection string for the PostgreSQL database.
    - `JWT_SECRET`: Secret key used for signing JWT tokens.

- **Next.js Configuration:**

    - `next.config.js`: Customize Next.js build and runtime options.

- **Docker Compose**
    - `docker-compose.yml` contains the configuration for the docker compose deployment. You can configure ports,
      volumes, and environment variables here.

## Contributing Guidelines

We welcome contributions! Here's how you can contribute:

1. **Fork the repository.**
2. **Create a new branch:** `git checkout -b feature/your-feature-name`
3. **Make your changes.**
4. **Commit your changes:** `git commit -m 'Add your feature'`
5. **Push to the branch:** `git push origin feature/your-feature-name`
6. **Submit a pull request.**

## License Information

This project has no specified license. All rights are reserved by the owner.

## Acknowledgments

- [Next.js](https://nextjs.org): For the React framework.
- [Tailwind CSS](https://tailwindcss.com): For the styling framework.
- [DaisyUI](https://daisyui.com/): For UI components.
- [Socket.io](https://socket.io/): For real-time communication.
- [JWT](https://jwt.io/): For authentication.
- [PostgreSQL](https://www.postgresql.org/): For the database.
- [React](https://reactjs.org/): For building the user interface.
- [Node.js](https://nodejs.org/): For the server-side runtime.
- [Prisma](https://www.prisma.io/): For the database ORM.
- [Docker](https://www.docker.com/): For containerization.