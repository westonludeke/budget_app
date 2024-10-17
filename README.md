```markdown
# Budget App

Budget App is a personal budget tracker tool designed to track and monitor credit card transactions over time. Users can upload a list of transactions in CSV format to the website, categorize the transactions, and track expenses over time.

## Overview

The Budget App is built using a Node.js backend with Express.js for routing and MongoDB as the database. The frontend uses EJS for templating and Bootstrap for responsive design. The app includes session-based authentication and allows users to upload CSV files, categorize transactions, and generate reports.

### Technologies Used

- **Node.js**: JavaScript runtime for building the app.
- **Express.js**: Web server framework for Node.js.
- **MongoDB**: NoSQL database for storing transactions and user information.
- **Mongoose**: ORM for MongoDB.
- **Multer**: Middleware for handling file uploads.
- **Body-parser**: Middleware for parsing request bodies.
- **EJS**: Templating engine for rendering HTML.
- **Bootstrap**: Front-end component library for responsive design.
- **bcrypt**: Library for hashing passwords.
- **dotenv**: Module for loading environment variables from a `.env` file.

### Project Structure

- **models/**: Contains Mongoose schemas for User and Transaction.
- **routes/**: Defines the routes for authentication, uploading files, and managing transactions.
- **public/**: Contains static files like CSS and JavaScript.
- **views/**: EJS templates for rendering HTML pages.
- **uploads/**: Directory for storing uploaded CSV files.
- **services/**: Contains utility functions, such as for interacting with LLM APIs.
- **server.js**: Main entry point for the application.

## Features

- **User Authentication**: Users can register, log in, and log out.
- **CSV Upload**: Users can upload CSV files containing transaction data.
- **Transaction Management**: Users can view, edit, and delete transactions.
- **Categorization**: Users can categorize transactions and add a close date.
- **Reporting**: Users can view reports of expenses categorized by month.

## Getting Started

### Requirements

- Node.js (version 14.x or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm (Node package manager)

### Quickstart

1. **Clone the repository**:
    ```sh
    git clone <repository_url>
    cd budget-app
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    - Copy the `.env.example` file to `.env`:
      ```sh
      cp .env.example .env
      ```
    - Fill in the values for `PORT`, `DATABASE_URL`, and `SESSION_SECRET` in the `.env` file.

4. **Run the application**:
    ```sh
    npm start
    ```

5. **Access the app**:
    - Open your browser and go to `http://localhost:3000`

### License

The project is proprietary (not open source). 

```
© 2024. All rights reserved.
```
```