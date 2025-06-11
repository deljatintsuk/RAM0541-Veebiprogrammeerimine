# RAM0541 Practice - Project
Aleksander Deljatintšuk

## Description
This project is a full-stack web application for a library lending system, built using a modern technology stack. The application allows users to register, log in, browse, and search for works, borrow available editions, return loans, and reserve items that are currently checked out.

Administrators have access to a dedicated dashboard where they can manage users and their roles, and get a complete overview of all loans and reservations within the system.

Core Functionality:

* User Authentication (JWT): Secure registration and login with JWT-based authentication. Users have roles (Reader, Admin) that restrict access to certain functionalities.
* Dynamic Book Search: Users can browse all items and use a dynamic search to find books by title, author, or category.
* Lending and Returning Logic: Logged-in users can borrow available items and return their own loans.
* Two-step Reservation System: If an item is checked out, a user can reserve it. When the item becomes available, the first user in the reservation queue is notified and has a limited time to confirm the loan.
* Personalized User Views: Each user has personal "My Loans" and "My Reservations" pages.
* Administrator Dashboard: Users with the 'Admin' role have access to a dashboard to:
    * View a list of all system users and manage their roles.
    * Oversee all loans and reservations.
    * Monitor overdue loans.

## Usage

### Database Setup
In your PostgreSQL server, create a new, empty database (e.g., libraryapp_db).
Execute the contents of the [database_setup.sql 2](https://github.com/deljatintsuk/RAM0541-Veebiprogrammeerimine/blob/main/Projekt/raamatukogulaenatussysteem_Final.sql) file on this database to create all the necessary tables, views, and rules.


### Backend Setup

```
# Clone the repository and navigate to the backend directory
git clone <your_repo_url>
cd <repo_name>/library-backend

# Create a .env file (use .env.example as a template) and enter your database credentials
DB_DATABASE=DATABASE_NAME
DB_USER=USER_NAME
DB_PASSWORD=USER_PASSWORD
DB_HOST=HOST_NAME
DB_PORT=HOST_PORT
DB_SCHEMA=DATABASE_SCHEMA
DB_DIALECT=postgres
SERVER_PORT=8080

# Install dependencies
npm install

# Seed the database with initial test data (roles, users, books)
npm run db:seed

# Start the backend development server
npm run dev

# The server is now running at http://localhost:8080
```

### Frontend Setup

```
# Open a new terminal window and navigate to the frontend directory
cd <repo_name>/library-frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev

# The application is now available at http://localhost:5173
```
### Demo Videos

Backend 
Frontend



