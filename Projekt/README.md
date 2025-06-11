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
Execute the contents of the database_setup.sql file on this database to create all the necessary tables, views, and rules.

