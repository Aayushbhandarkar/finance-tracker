💵 Personal Finance Tracker

A simple full-stack app to track your income and expenses. Add, edit, and delete transactions easily with a clean UI.

✨ Features

➕ Add income & expenses

✏️ Edit transactions

❌ Delete transactions

📋 View all in one place

📊 Track with title, amount (+/−), category, and date

🖼️ Screenshots
<img width="1910" height="1050" alt="Screenshot 2025-09-11 153203" src="https://github.com/user-attachments/assets/58e2e1ac-9f0c-406c-868b-9e6669595414" />
<img width="1848" height="1049" alt="Screenshot 2025-09-11 153241" src="https://github.com/user-attachments/assets/bcba279d-6a9d-4ed8-9641-939b9498397c" />
<img width="1909" height="1024" alt="Screenshot 2025-09-11 153312" src="https://github.com/user-attachments/assets/0a87ed6a-cce8-4fe8-aeda-074810484951" />
<img width="1843" height="1039" alt="Screenshot 2025-09-11 153650" src="https://github.com/user-attachments/assets/480259ee-ebde-49cf-814c-c3f1e21b3a73" />



🌍 Deployment

Backend → https://finance-tracker-backend-afpg.onrender.com

Frontend → https://finance-tracker-tzhl.onrender.com

🔧 Built With

Backend: Node.js, Express, MongoDB (REST API for transactions)

Frontend: React + React Router

📍 API Overview

GET /api/transactions → fetch all transactions

POST /api/transactions → create a new transaction

PUT /api/transactions/:id → update by ID

DELETE /api/transactions/:id → remove by ID

🖥️ Frontend Pages

/ → Home (list of all transactions)

/add → Add new transaction form

/:id/edit → Edit a transaction

/:id/delete → Delete confirmation

📝 Transaction Model
| Field    | Type   | Description                           |
| -------- | ------ | ------------------------------------- |
| title    | String | Short name/description                |
| amount   | Number | Positive = income, Negative = expense |
| date     | Date   | When the transaction happened         |
| category | String | e.g., Food, Travel, Salary            |

📌 Why This Project?

Built as a MERN practice project to:

Learn REST API design

Handle CRUD operations

Connect React frontend with Express backend

Manage forms and state
