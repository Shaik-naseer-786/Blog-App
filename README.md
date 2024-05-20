# MERN Blog Application

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)


## Introduction
The MERN Blog Application is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to register, log in, create blog posts, view posts, and edit their profile information. This application demonstrates user authentication, CRUD operations, and a responsive front-end.

## Features
- User Registration and Login
- User Profile Management (Update Avatar, Update Details)
- Create, Read, Update, and Delete Blog Posts
- Secure Password Handling
- Responsive Design

## Technology Stack
- **Frontend:** React.js, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS, React Icons

## Prerequisites
- Node.js and npm installed
- MongoDB instance running locally or a cloud MongoDB service
- Git installed

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/MERN_Blog.git
   cd MERN_Blog


   ==============================================================================================================================================
**Backend Setup:**

**Navigate to the server directory:**

cd server
**Install backend dependencies:**

npm install
**Create a .env file in the server directory and add the following:**
env

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
Frontend Setup:

**Navigate to the client directory:**

cd ../client
**Install frontend dependencies:**

npm install
Running the Application
**Start the Backend Server:**


cd server
npm run dev
**Start the Frontend Server:**


cd ../client
npm start
The application will be accessible at http://localhost:3000.

API Endpoints
User Endpoints
POST /api/users/register
Register a new user.
POST /api/users/login
Log in a user and return a JWT token.
PUT /api/users/edit
Edit user profile details (name, email, password).
POST /api/users/change-avatar
Change user avatar.
Blog Post Endpoints
GET /api/posts
Retrieve all blog posts.
POST /api/posts
Create a new blog post.
GET /api/posts/:id
Retrieve a specific blog post by ID.
PUT /api/posts/:id
Update a blog post by ID.
DELETE /api/posts/:id
Delete a blog post by ID.
**Usage**
Registration and Login
Navigate to the registration page and create a new account by providing a username, email, and password.
Log in using your registered email and password. A JWT token will be stored in local storage.
**Profile Management**
Update your profile information by navigating to the profile page.
Change your avatar by uploading a new image.
Edit your name, email, and password.
**Creating and Managing Blog Posts**
Create new blog posts from the dashboard.
View all blog posts on the homepage.
Edit or delete your own blog posts from the dashboard.
**Contributing**
We welcome contributions to improve this project. Please fork the repository and create a pull request with your changes.
