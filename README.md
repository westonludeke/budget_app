# Budget App

Budget App is a personal budget tracker tool designed to track and monitor credit card transactions over time. Users can upload a list of transactions in CSV format, categorize them, and track expenses over time.

## Overview

Budget App is built using the following technologies:
- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing transactions.
- **Mongoose**: ORM for MongoDB.
- **Multer**: Middleware for handling file uploads.
- **Body-Parser**: Middleware for parsing request bodies.
- **EJS**: Embedded JavaScript templating for rendering HTML.
- **Bootstrap**: Front-end component library for responsive design.

### Project Structure

- **.env**: Configuration file for environment variables.
- **.env.example**: Template for setting up environment variables.
- **.gitignore**: Specifies files to be ignored by Git.
- **README.md**: Comprehensive overview of the project.
- **genezio.yaml**: Configuration file for Genezio cloud platform.
- **models/**: Contains Mongoose schemas for `Transaction` and `User`.
- **public/**: Static files including CSS and JavaScript.
- **routes/**: Defines routes for authentication, transactions, uploads, and reports.
- **server.js**: Main server file that sets up the Express server.
- **services/**: Contains services for interacting with external APIs.
- **uploads/**: Directory for uploaded CSV files.
- **views/**: EJS templates for rendering HTML pages.

## Features

- **User Authentication**: Session-based authentication using username and password.
- **CSV Upload**: Users can upload CSV files containing transaction data.
- **Transaction Management**: View, edit, and delete transactions.
- **Categorization**: Manually categorize transactions and add close dates.
- **Grouping**: Transactions are grouped by close date on the homepage.
- **Reporting**: View expense breakdowns by category and month on the Reports page.

## Getting Started

### Requirements

- **Node.js**: Ensure Node.js is installed on your machine.
- **MongoDB**: Either install MongoDB locally or use a cloud version such as MongoDB Atlas.

### Quickstart

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd budget-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file based on the `.env.example` template and fill in the required values.

4. **Run the application**:
   ```bash
   npm start
   ```

5. **Access the application**:
   - Open your web browser and navigate to `http://localhost:<PORT>` (replace `<PORT>` with the port number specified in your `.env` file).

## License

This project is open source and licensed under the MIT License. You are free to fork, modify, distribute, and use this project.