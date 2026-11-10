# Movie Website ? React + JSON Server

## Requirements

- Node.js **20.19+ on the 20.x branch**, or **22.12 or later**, as required by the installed Vite version.
- npm, included with Node.js. Check your versions with `node --version` and `npm --version`.
- Run the commands below from the `movie-wedsite` directory containing `package.json`.

## Installation and Development

Install the dependencies specified in `package-lock.json`:

```sh
npm ci
```

There is no need to install JSON Server globally: version `0.17.4` is already declared in this project.

**Terminal 1 ? start the API:**

```sh
npm run server
```

Keep this terminal open. You can check the API at `http://localhost:5000/movies`.

**Terminal 2 ? start the frontend:**

```sh
npm run dev
```

Open the **Local** URL printed by Vite, usually `http://localhost:5173`.
If port 5173 is already in use, Vite may choose another port. Press `Ctrl+C` in each terminal to stop its server.

## API Configuration

The frontend uses `http://localhost:5000` by default; no environment file is required when using this port. The default JSON Server port is set in `json-server.json`.
To change the API address, copy `.env.example` to `.env.local`. In PowerShell:

```powershell
Copy-Item .env.example .env.local
```

For example, if another application is using port 5000:

```sh
npm run server -- --port 5001
```

Set the contents of `.env.local` to:

```dotenv
VITE_API_BASE=http://localhost:5001
```

Restart Vite after changing the configuration. If you are viewing a production build, rebuild it first.
`.env.local` is already ignored by Git. Variables prefixed with `VITE_*` are included in the frontend code, so do not put passwords or secret keys there.
To access the app from another device, the API must have an address reachable from that device; `localhost` always refers to the device running the browser.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend development server |
| `npm run server` | Start JSON Server on port 5000 and watch `db.json` |
| `npm run lint` | Run ESLint |
| `npm test` | Run automated tests with separate in-memory data |
| `npm run build` | Generate an optimized frontend build in `dist/` |
| `npm run preview` | Preview the build, usually on port 4173 |

To preview a build, keep the API running in a separate terminal, then run:

```sh
npm run build
npm run preview
```

`preview` only serves the frontend; it does not start JSON Server. Use the URL printed in the terminal.

## Accounts and Data

- Initial admin credentials: `admin@gmail.com` / `123`. Changing the password on the Account page updates the server; login no longer uses a hardcoded password override.
- `db.json` stores the `movies`, `users`, `favorites`, and `history` collections.
- Authentication is simulated for this coursework project. JSON Server does not enforce authentication or authorization, and demo passwords are stored in plain text. Do not use real accounts or passwords.
- localStorage is used only for the login session. When signing in again from a browser containing legacy data, an old account is imported if its email does not already exist on the server and its password matches. Missing favorites and history are imported without overwriting existing server records. Legacy data is removed only after it has been transferred successfully.
- Accounts deleted by an admin are marked `deleted` so an old browser cannot import them again. These accounts are hidden from the management list and cannot sign in.
- New accounts require passwords of at least 6 characters. Existing accounts can still sign in with their current passwords.

## Movie Lists

Pages share the movie catalog during an application session. Adding, editing, or deleting a movie in the management page updates the shared data after the server confirms the change.
List URLs can be opened directly, reloaded, or shared. Examples:

- `/all-movies?type=hot`
- `/all-movies?type=single`
- `/all-movies?genre=Anime`
- `/all-movies?country=Nhật%20Bản` (Japan; the query value matches the movie data)
- `/all-movies?type=favorites` (the currently signed-in account's list)

## Verification

```sh
npm test
npm run build
npm run lint
```

Tests run JSON Server on a randomly assigned port with in-memory data; they do not write to the project's `db.json`.

## Project Structure

- `src/pages/`: pages loaded lazily by route.
- `src/components/`: UI components.
- `src/auth/`: login sessions and route guards.
- `src/lib/`: API configuration, shared movie data, accounts, favorites, history, and validation.
- `public/images/`, `public/videos/`: static images and videos. Use `/images/...` or `/videos/...` when entering paths.
- `tests/`: automated tests.
- `db.json`: JSON Server data. Changes made through the app are saved to this file; back it up before experimenting with large data changes.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `npm` is not recognized | Install a supported Node.js version, then reopen the terminal |
| `package.json` cannot be found | Change to the correct `movie-wedsite` directory |
| Movies fail to load or sign-in fails | Check that the API is running, try opening `/movies`, and confirm that its port matches `VITE_API_BASE` |
| `EADDRINUSE` on port 5000 | Use a different API port as described above |
| Vite reports an unsupported Node.js version | Compare `node --version` with the Requirements section |
| Changes to `.env.local` have no effect | Restart Vite, or rebuild if using `preview` |
| An old account is missing | Sign in again from the browser where the account was stored to migrate its data; check any server error messages |
| Imports still reference `libary` or `AcountUser` | The new names are `src/lib/` and `AccountUser`; close the old IDE tabs and open the files at their new paths |
