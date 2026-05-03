# How to Run the Project Manually

To run both the Frontend (FE) and Backend (BE) simultaneously, simply use the `dev` script provided in the root directory:

```bash
# From the root directory (/Users/a37726/personal/challan)
npm run dev
```

This script leverages `concurrently` to automatically start both the backend and frontend at the same time.

### Running Them Separately

If you prefer to run them in separate terminal windows instead, you can do the following:

**Terminal 1 (Backend):**
```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Stopping the Servers

If you need to kill the processes (for example, if a port is stuck in use), you can stop them with `Ctrl + C` in the terminal they are running. As a last resort, if orphaned processes remain, you can forcefully kill all Node processes:

```bash
pkill -f node
# or
killall node
```
