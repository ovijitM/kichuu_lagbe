# Kichuu Lagbe

MERN foundation for the Bashundhara residential super app. The full backlog is in [task.md](task.md). Product background is in [resources/Project_Plan.md](resources/Project_Plan.md).

## Run locally

MongoDB must be listening on `127.0.0.1:27017`. This machine can start the installed server with:

```powershell
& "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "$env:LOCALAPPDATA\kichuu-lagbe-mongo"
```

Docker is optional. `docker compose up -d` from this folder does the same job when Docker is installed.

```powershell
npm install
npm run seed
npm run dev
```

Web: http://localhost:5173  
API: http://localhost:5000/api/health

Copy is not required for this machine: [server/.env](server/.env) is already created. Change the seed emails and passwords there, then run `npm run seed` again. [server/.env.example](server/.env.example) lists the same keys.

## Dev sign-in

Email and password for the five seed accounts are in `server/.env`. This email login is temporary. The production login system will replace it.

| Role | Email |
|---|---|
| Resident | tanvir@kichuulagbe.local |
| Shop owner | shop@kichuulagbe.local |
| Service provider | kabir@kichuulagbe.local |
| Rider | hasan@kichuulagbe.local |
| Admin | admin@kichuulagbe.local |

Signup on `/login` can create a resident, shop owner, service provider, or rider. Admin is seed-only.

The shells are empty on purpose. Screen content is scheduled in `task.md`.
