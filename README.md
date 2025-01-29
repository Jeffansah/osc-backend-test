# Open Study College GraphQL API

## Overview

This is a GraphQL API for Open Study College that allows internal users to retrieve and manage data related to distance learning courses. The API supports various operations, including querying/mutating courses and collections. It also includes user authentication and authorization features using JWT (JSON Web Tokens).

## Features

- **GraphQL Queries**:

  - `courses(limit: Int, sortOrder: SortOrder)`: Retrieve a list of courses with optional pagination and sorting.
  - `course(id: string)`: Retrieve a specific course by its ID.
  - `collections`: Retrieve a list of all course collections (categories).
  - `collection(id: string)`: Retrieve a specific collection along with all contained courses.
  - `users`: Retrieve a list of all signed up users -`user(id: string)`: Retrieve one user

- **GraphQL Mutations**:

  - `addCourse(input: CourseInput)`: Add a new course to the database.
  - `updateCourse(id:string, input: CourseInput)`: Update a course's details based on its ID.
  - `deleteCourse(id: string)`: Delete a course from the database by its ID.
  - `register(input: UserRegisterInput)`: Register a new user.
  - `login(input: UserLoginInput)`: Authenticate a user and return a JWT token.
  - `logout`: Log out the user by clearing the JWT token.
  - `deleteUser(id: string)`: delete a user either by the authenticated user or admin

- **Authentication and Authorization**:
  - Users can register and log in to receive a JWT token.
  - Protected mutations require a valid JWT token for access.
  - Role-based authorization allows admins to perform all actions while regular users can only add, update or delete their own courses.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Jeffansah/osc-backend-test.git
   cd osc-backend-test

   ```

2. **Install Dependencies:**

   ```bash
   npm install

   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with:

   ```plaintext
   PORT=your_port
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_connection_string

   ```

4. **Run the Application:**:
   Start the server in development mode:

```bash
npm run dev

```

5. **Access the GraphQL Playground:**:
   Open your browser and navigate to `http://localhost:5000/graphql` to test queries and mutations.

## Example Queries and Mutations

### User Queries

**Get All Users**

```graphql
query getAllUsers {
  users {
    name
    email
    role
  }
}
```
