
# REST API for Articles

This project is a REST API built using **Node.js**, **Express**, **TypeORM**, **PostgreSQL**, and **TypeScript**. It allows managing articles and tags with filtering, sorting, and pagination.

---

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/palex98/articles
cd rest-articles
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=articlesdb
DB_USER=yourusername
DB_PASSWORD=yourpassword
PORT=3000
```

### 4. Initialize the Database
Use the provided SQL scripts to create and seed the database.

#### Option 1: Run SQL Scripts Manually
Run the scripts located in the `docker/` directory (`init.sql` and `seed.sql`) using your PostgreSQL client.

#### Option 2: Use Docker Compose
Run the following command to automatically set up the database:
```bash
docker-compose up --build
```

### 5. Start the Application
#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`.

---

## API Endpoints

### **GET /articles**
Retrieve a list of articles with filtering, sorting, and pagination.

#### Query Parameters
| Parameter      | Description                                                | Example                          |
|----------------|------------------------------------------------------------|----------------------------------|
| `title`        | Filter by title (partial match, case-insensitive).         | `?title=tech`                   |
| `author`       | Filter by author's name.                                   | `?author=Jane Doe`              |
| `tags`         | Filter by tags (comma-separated).                          | `?tags=tech,science`            |
| `status`       | Filter by status (`published`, `draft`, `archived`).       | `?status=published`             |
| `from` / `to`  | Filter by creation date range.                             | `?from=2024-01-01&to=2024-12-31`|
| `minViews`     | Filter by minimum view count.                              | `?minViews=100`                 |
| `maxViews`     | Filter by maximum view count.                              | `?maxViews=500`                 |
| `sortBy`       | Sort results by `createdAt` or `views`.                    | `?sortBy=createdAt`             |
| `order`        | Sort order: ascending (`asc`) or descending (`desc`).      | `?order=desc`                   |
| `page`         | Page number (default: `1`).                                | `?page=2`                       |
| `limit`        | Items per page (default: `10`).                            | `?limit=5`                      |

#### Example:
```bash
GET /articles?title=tech&tags=tech,science&minViews=100&maxViews=200&page=2&limit=5
```

---

## Database

### Tables:
1. **article**: Stores article details.
2. **tag**: Stores unique tags.
3. **article_tag_entities_tag**: Many-to-many join table linking articles and tags.

### Seed Data:
- Tags: `tech`, `science`, `innovation`.
- Articles:
  - `Tech Innovations` with `tech`, `innovation`.
  - `Science Breakthroughs` with `science`.
  - `Archived Thoughts` with `tech`.
