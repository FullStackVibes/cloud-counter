# CloudCounter v2 🚀

A decoupled, full-stack counter application featuring a modern UI frontend and a robust Node.js/Express API backend, persisting state across sessions using a local file-based SQLite database.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Fetch API, Live Server hosting)
- **Backend:** Node.js, Express.js, CORS
- **Database:** SQLite3 (Self-contained relational database file)

## 🏗️ Architecture Layout
- **Frontend Engine:** Interacts with the user interface, dispatching local network requests to update counters.
- **API Server:** Receives payload events (increment, decrement, reset), structures SQL logic, and updates state records.
- **SQLite Database:** Permanently stores balance counts on the hard drive inside `database.sqlite`.

## 🏃‍♂️ How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/FullStackVibes/cloud-counter.git
cd cloud-counter
```
