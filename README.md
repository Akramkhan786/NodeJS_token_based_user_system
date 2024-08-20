# NodeJS_token_based_user_system
Secure token-based user system in NodeJS

This project is a Node.js API using Express and Realm to perform CRUD operations on User and Address entities.

## Getting Started

### Prerequisites
- Node.js (v12.x or higher)
- npm (v6.x or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Akramkhan786/NodeJS_token_based_user_system.git
   cd NodeJS_token_based_user_system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

1. Start the server:
   ```bash
   node index.js
   ```
   The server will start on port `3000` by default.

### API Endpoints

- `GET /filter_users_by_name?searchedName=<name>` - Filter users by name.
- `POST /insert_new_user` - Insert a new user (requires `tokenkey` in headers).
- `POST /insert_address_to_user` - Insert a new address to a user (requires `tokenkey` in headers).
- `PUT /update_user` - Update an existing user (requires `tokenkey` in headers).
- `DELETE /delete_user` - Delete a user (requires `tokenkey` in headers).
- `DELETE /delete_all_users` - Delete all users (requires `tokenkey` in headers).

### Testing the API
Use Postman or any other API client to test the endpoints. Make sure to include the `tokenkey` in the headers when required (`tokenkey: abc123456789`).
