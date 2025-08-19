# Drop Later

Drop Later is a fully containerized service for scheduling and delivering notes via webhooks.  
It consists of:
- **API service** (Express + MongoDB)
- **Sink service** (receives webhook callbacks)
- **MongoDB database** (for persistence)
- **Worker service** (for running a background process to manage due notes)
- **Docker Compose** for orchestrating everything

---

## Features

- Create scheduled notes with title, body, release time, and webhook URL  
- Automatically deliver notes at the correct time
- Polling method to fetch due notes and process them in the background  
- Structured logging using [pino](https://github.com/pinojs/pino) and `pino-pretty`  
- Fully containerized — no manual installs except Docker  
- Health check endpoint for API status  
- Automated tests with Jest + Supertest  

---

## Environment Variables

All environment variables are defined in the `docker-compose.yaml` file.  
You can customize them either by:
- editing `docker-compose.yml` directly, **or**
- creating a `.env` file in the project root (Compose will pick this up automatically).

### API service variables
- `PORT` — API server port (default: `8000`)
- `MONGO_URI` — MongoDB connection string (default: `mongodb://mongo:27017/pinsaar`)
- `TOKEN` — secret token used for Authorization headers

### Sink service variables
- `PORT` — Sink server port (default: `4000`)

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/drop-later.git
cd drop-later
```
### 2. Build images and run 
```bash
docker-compose up -d
```
--- 

Test cases

The API service includes simple test cases.
To run those test cases
```bash
docker exec -it drop-later-api-1  npm test
```

---

Diagram

This is the short flow diagram of the project
![Diagram](https://github.com/user-attachments/assets/997d53c0-acd8-4024-b5b4-ebae57fe53ff)

