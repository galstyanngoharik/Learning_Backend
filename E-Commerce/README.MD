# E-Commerce Backend API

Backend application created with Node.js and Express.js for managing an E-Commerce platform. The project utilizes a file-based data persistence mechanism (`.json` files), JSON Web Tokens (JWT) for authentication, and Role-Based Access Control (RBAC) for authorization.

---

## 🛠 Features & Requirements

* **Data Persistence**: Reads and writes data on demand using `.json` files (`users.json`, `products.json`, `orders.json`).
* **Authentication & Security**: Password hashing with `bcryptjs` and request authorization using `jsonwebtoken`.
* **Role-Based Access Control**:
  * **Customer**: Can create orders and view their own order history.
  * **Admin**: Has full CRUD control over products and can view all orders across the system.
* **Two-Phase Order Logic**: Validates item availability and stock before updating product inventories and saving the order record.

---

## 📁 Project Structure

```text
.
├── utils/
│   └── fileUtils.js        # Helper functions for reading/writing JSON files
├── middleware/
│   └── auth.js             # Authentication & Role-based Authorization middlewares
├── routes/
│   ├── auth.js             # User authentication routes (/register, /login)
│   ├── products.js         # Product management routes (CRUD)
│   └── orders.js           # Order management routes
├── users.json              # Persistent storage for users
├── products.json           # Persistent storage for products
├── orders.json             # Persistent storage for orders
├── server.js               # Express application entry point
├── package.json
└── README.md