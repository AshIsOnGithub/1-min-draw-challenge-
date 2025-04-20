# 1-Minute Drawing Challenge

This project is a web application that allows users to participate in a timed drawing challenge. Users are given a random drawing prompt and have one minute to create a drawing using a canvas.  After submitting their drawing, they can view a gallery of other users' submissions and vote on their favorites.  The application uses Supabase for authentication and database management.

## Features

* **Timed Drawing Challenge:** Users are presented with a random prompt and a one-minute timer to complete their drawing.
* **Canvas-Based Drawing:** A canvas element provides a simple drawing interface.
* **User Authentication:** Secure user authentication using Supabase Auth.
* **User Profile:** Users can create a profile and choose a display name.
* **Drawing Submission:** Users can submit their drawings to the database.
* **Voting Gallery:** A gallery displays submitted drawings, allowing users to vote.
* **Real-time Updates:** (Implied, but not explicitly shown in the provided code)  The voting system likely updates the vote count in real-time or near real-time.

## Usage

1.  Sign up or log in to the application.
2.  Go to the "Dashboard" to start a new challenge.
3.  A random drawing prompt will be displayed.
4.  Draw your interpretation of the prompt on the canvas within the one-minute time limit.
5.  Submit your drawing.
6.  View the gallery to see other users' submissions and vote.

## Installation

1.  Clone the repository: `git clone <repository_url>`
2.  Navigate to the project directory: `cd drawing-challenge`
3.  Install dependencies: `npm install`
4.  Start the development server: `npm start`
5.  Set environment variables: `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` need to be configured with your Supabase project's details.  These are typically set in a `.env` file.

## Technologies Used

* **React:** A JavaScript library for building user interfaces. Used for the frontend of the application.
* **Supabase:** A backend-as-a-service platform providing authentication, database, and storage. Used for user authentication, storing drawing data, and storing user profiles.
* **Supabase JS Client Library:** The official JavaScript client library for interacting with Supabase.  Facilitates communication between the React frontend and the Supabase backend.
* **PostgreSQL:** The database system used by Supabase. Stores drawing data and user information.
* **Node.js & npm:** Node.js runtime environment and npm package manager for managing project dependencies.


## Configuration

Before running the application, you must set the following environment variables:

*   `REACT_APP_SUPABASE_URL`: Your Supabase project URL.
*   `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key.


## Dependencies

The project dependencies are listed in `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.48.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Testing

No formal testing framework is included in the provided code.  Testing should be added for improved code quality and robustness.
