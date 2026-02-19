# StickyBoard

A real-time multiplayer sticky note board, inspired by tools like Excalidraw. Create a board, share the link, and anyone with it can join and collaborate instantly. No account needed.

Every action: adding, moving, editing or deleting a note, syncs live across all connected users via WebSockets. You can see who else is on the board in real time via presence avatars in the toolbar.

Built as a portfolio project to demonstrate full stack JavaScript skills.

## Live demo

[Click here](https://sticky-board-production.up.railway.app)

Running on free tier. The server may be slow or unresponsive at times depending on  credits. If the board doesn't load, try refreshing after a few seconds.

## What it does

- Create a board and get a shareable URL
- Add, move, edit and delete sticky notes
- Changes sync in **real-time** across all connected users
- See who else is on the board via presence avatars
- Notes and positions are saved to the database
- Pick note colors from the toolbar
- Recent boards persisted so you can find them again

## Tech stack

- Node.js and Express for the backend
- PostgreSQL for the database
- Socket.io for real time communication
- Vanilla JavaScript and CSS (no frameworks) for the frontend
- Jest and Supertest for API tests

## Running tests

```bash
npm test
```

Tests cover the happy path for boards and notes API endpoints.

## Project structure

```
server/
  controllers/    request handling logic
  routes/         express route definitions
  models/         database models
  socket.js       socket.io event handlers
  app.js          express app setup
  server.js       http server entry point
client/
  js/             vanilla js - individual file per concern
  css/            styles
  index.html      landing page
  board.html      board workspace
tests/
  integration/    supertest API tests
```

## How the real time sync works

When you open a board your browser connects to the server via
Socket.io and joins a room identified by the board ID. Any change
you make - adding, moving, editing or deleting a note - gets saved
to the database via the REST API and broadcast to everyone else in
the room via the socket. Their boards update without refreshing.

## What I would add next

- User accounts with OAuth authentication
- Board ownership and access control
- Undo and redo for your own actions
- Filter and search notes
- Export board as PNG or JSON
- Mobile touch support for dragging notes

- Rewrite the backend in Go to handle the volume of concurrent connections and database queries more efficiently. Node works fine at this scale but Go would give better performance under load with lower memory overhead.
