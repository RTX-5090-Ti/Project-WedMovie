import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import vm from "node:vm";

test("cursor cleans up listeners and keeps one animation loop across focus and remount", async () => {
  class Events extends EventTarget {
    handlers = new Map();
    addEventListener(type, handler, options) {
      if (!this.handlers.has(type)) this.handlers.set(type, new Set());
      this.handlers.get(type).add(handler);
      super.addEventListener(type, handler, options);
    }
    removeEventListener(type, handler, options) {
      this.handlers.get(type)?.delete(handler);
      super.removeEventListener(type, handler, options);
    }
    get count() { return [...this.handlers.values()].reduce((sum, handlers) => sum + handlers.size, 0); }
  }
  const document = new Events();
  document.hasFocus = () => true;
  const window = new Events();
  const desktopPointer = new Events();
  desktopPointer.matches = true;
  window.matchMedia = () => desktopPointer;
  window.innerWidth = 1200;
  window.innerHeight = 800;
  const frames = new Map();
  let nextFrame = 0;
  window.requestAnimationFrame = (callback) => { frames.set(++nextFrame, callback); return nextFrame; };
  window.cancelAnimationFrame = (id) => frames.delete(id);
  let strokes = 0;
  const context = { beginPath() {}, moveTo() {}, quadraticCurveTo() {}, stroke() { strokes++; }, closePath() {}, clearRect() {} };
  const canvas = { getContext: () => context };
  let cleanup;
  const sandbox = { window, document, useEffect: (setup) => { cleanup = setup(); } };
  vm.createContext(sandbox);
  const source = (await readFile("src/components/Cursor/useCanvasCursor.js", "utf8"))
    .replace('import { useEffect } from "react";', "")
    .replace("export default function useCanvasCursor", "function useCanvasCursor");
  vm.runInContext(`${source}\nglobalThis.mount = useCanvasCursor;`, sandbox);
  for (let mount = 0; mount < 2; mount++) {
    sandbox.mount({ current: canvas });
    window.dispatchEvent(new Event("focus"));
    assert.equal(frames.size, 0);
    const move = Object.assign(new Event("pointermove"), { pointerType: "mouse", clientX: 40, clientY: 60 });
    document.dispatchEvent(move);
    document.dispatchEvent(move);
    assert.equal(frames.size, 1);
    const [id, callback] = frames.entries().next().value;
    frames.delete(id);
    callback();
    assert.equal(frames.size, 1);
    assert.ok(strokes > 0);
    window.dispatchEvent(new Event("blur"));
    assert.equal(frames.size, 0);
    window.dispatchEvent(new Event("focus"));
    window.dispatchEvent(new Event("focus"));
    assert.equal(frames.size, 1);
    desktopPointer.matches = false;
    desktopPointer.dispatchEvent(new Event("change"));
    assert.equal(canvas.hidden, true);
    assert.equal(frames.size, 0);
    assert.equal(document.count, 0);
    assert.equal(window.count, 0);
    document.dispatchEvent(move);
    assert.equal(frames.size, 0);
    desktopPointer.matches = true;
    desktopPointer.dispatchEvent(new Event("change"));
    assert.equal(canvas.hidden, false);
    document.dispatchEvent(Object.assign(new Event("pointermove"), { pointerType: "touch", clientX: 40, clientY: 60 }));
    assert.equal(frames.size, 0);
    document.dispatchEvent(move);
    assert.equal(frames.size, 1);
    cleanup();
    assert.equal(frames.size, 0);
    assert.equal(document.count, 0);
    assert.equal(window.count, 0);
    assert.equal(desktopPointer.count, 0);
  }
  desktopPointer.matches = false;
  sandbox.mount({ current: canvas });
  assert.equal(canvas.hidden, true);
  assert.equal(document.count, 0);
  assert.equal(frames.size, 0);
  cleanup();
  sandbox.mount({ current: null });
  assert.equal(cleanup, undefined);
});

test("API, shared movies, URL filters and demo accounts work against JSON Server", async (t) => {
  const require = createRequire(import.meta.url);
  const jsonServer = require("json-server");
  const original = await readFile("db.json", "utf8");
  const database = JSON.parse(original);
  // No real accounts or mutations: this router uses a separate object in memory.
  database.users = [{ id: "admin", email: "admin@gmail.com", name: "Admin", role: "admin", password: "123" }];
  database.favorites = [];
  database.history = [];
  const app = jsonServer.create();
  let movieReads = 0;
  let failPath = null;
  app.use((req, res, next) => { if (req.path === failPath) res.status(503).json({ error: "Test outage" }); else next(); });
  app.use((req, res, next) => { if (req.method === "GET" && req.path === "/movies") movieReads++; next(); });
  app.use(jsonServer.bodyParser);
  app.use(jsonServer.router(database));
  const server = await new Promise((resolve) => { const instance = app.listen(0, "127.0.0.1", () => resolve(instance)); });
  const directory = await mkdtemp(join(tmpdir(), "movie-services-"));
  const base = `http://127.0.0.1:${server.address().port}`;
  const storage = new Map();
  globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)), removeItem: (key) => storage.delete(key) };
  globalThis.window = new EventTarget();
  try {
    const output = join(directory, "services.mjs");
    await build({
      stdin: { contents: ["api", "movieStore", "movieFilters", "validation", "users", "favorites", "history"].map((name) => `export * from './src/lib/${name}.js';`).join("\n"), resolveDir: process.cwd() },
      bundle: true, platform: "node", format: "esm", outfile: output,
      define: { "import.meta.env": JSON.stringify({ VITE_API_BASE: base }) },
    });
    const service = await import(pathToFileURL(output).href);
    await t.test("one catalog request for concurrent readers; writes update all subscribers", async () => {
      await Promise.all(Array.from({ length: 8 }, () => service.loadMovies()));
      assert.equal(movieReads, 1);
      await service.loadMovies();
      assert.equal(movieReads, 1);
      let notifications = 0;
      const unsubscribe = service.subscribeMovies(() => notifications++);
      const created = await service.saveMovie({ id: "test-movie", title: { vi: "Phim thử", en: "Test movie" }, featured: true }, true);
      assert.equal(service.getMoviesSnapshot().data[0].id, created.id);
      await service.saveMovie({ id: created.id, title: { vi: "Đã sửa", en: "Edited" } });
      assert.equal(service.getMoviesSnapshot().data[0].title.vi, "Đã sửa");
      await service.deleteMovie(created.id);
      assert.equal(service.getMoviesSnapshot().data.some((movie) => movie.id === created.id), false);
      assert.equal(notifications, 3);
      unsubscribe();
    });
    await t.test("URL criteria survive serialization and filter the full catalog", () => {
      const url = service.moviesUrl({ genre: ["Hành động", "Anime"], country: "Nhật Bản" });
      const params = new URL(url, "http://localhost").searchParams;
      assert.deepEqual(params.getAll("genre"), ["Hành động", "Anime"]);
      assert.equal(params.get("country"), "Nhật Bản");
      const movies = service.getMoviesSnapshot().data;
      assert.equal(service.filterMovies(movies, new URLSearchParams("type=hot")).every((movie) => movie.featured), true);
      assert.equal(service.filterMovies(movies, new URLSearchParams("genre=Anime")).every((movie) => service.hasGenre(movie, "Anime")), true);
      assert.equal(service.filterMovies(movies, new URLSearchParams()).length, database.movies.length);
      assert.equal(service.textKey("Điện Ảnh"), "dien anh");
    });
    await t.test("validation rejects malformed input and preserves zero rating", () => {
      assert.ok(service.validateAccount({ name: "Test", email: "bad", password: "123456" }));
      assert.ok(service.validateAccount({ name: "   ", email: "test@example.com", password: "123456" }));
      assert.ok(service.validateMovie({ titleVi: "A", titleEn: "B", year: "abc" }));
      assert.ok(service.validateMovie({ titleVi: "A", titleEn: "B", rating: "11" }));
      assert.equal(service.validateMovie({ titleVi: "A", titleEn: "B", year: "2025", rating: "0" }), "");
    });
    const user = await service.createUser({ email: "  TEST@EXAMPLE.COM  ", name: " Test ", password: "abcdef" });
    const other = await service.createUser({ email: "other@example.com", name: "Other", password: "abcdef" });
    await t.test("account uniqueness, profile, password and admin password persistence", async () => {
      assert.equal(user.email, "test@example.com");
      await assert.rejects(service.createUser({ email: "TEST@example.com", name: "Duplicate", password: "abcdef" }), /tồn tại/);
      await assert.rejects(service.authenticate({ email: user.email, password: "wrong" }));
      assert.equal((await service.authenticate({ email: user.email, password: "abcdef" })).user.password, undefined);
      await service.updateProfile(user.id, { name: "New name", gender: "female" });
      assert.equal((await service.getUser(user.id)).name, "New name");
      await assert.rejects(service.changePassword(user.id, "wrong", "new-password"));
      await service.changePassword(user.id, "abcdef", "new-password");
      await assert.rejects(service.authenticate({ email: user.email, password: "abcdef" }));
      assert.equal((await service.authenticate({ email: user.email, password: "new-password" })).user.id, user.id);
      await service.changePassword("admin", "123", "admin-new-password");
      await assert.rejects(service.authenticate({ email: "admin@gmail.com", password: "123" }));
      assert.equal((await service.authenticate({ email: "admin@gmail.com", password: "admin-new-password" })).user.role, "admin");
    });
    const movie = database.movies[0];
    await t.test("favorites and history persist on server, isolated per account", async () => {
      assert.equal((await service.toggleFav(user.id, movie)).added, true);
      assert.equal((await service.loadFavorites(user.id))[0].title.vi, movie.title.vi);
      assert.equal((await service.loadFavorites(other.id)).length, 0);
      await service.pushHistory(user.id, movie);
      await service.pushHistory(user.id, movie);
      assert.equal((await service.loadHistory(user.id)).length, 1);
      storage.clear(); // another browser has no local data
      assert.equal((await service.loadFavorites(user.id)).length, 1);
      assert.equal((await service.loadHistory(user.id)).length, 1);
      await service.removeFromHistory(user.id, movie.id);
      assert.equal((await service.loadHistory(user.id)).length, 0);
      assert.equal((await service.toggleFav(user.id, movie)).added, false);
    });
    await t.test("legacy migration is repeatable and deleted users cannot be imported again", async () => {
      const legacy = { email: "legacy@example.com", name: "Legacy", password: "1" };
      storage.set("users_db", JSON.stringify([legacy]));
      storage.set(`fav_${legacy.email}`, JSON.stringify([movie]));
      storage.set(`history_${legacy.email}`, JSON.stringify([movie]));
      const { user: migrated } = await service.authenticate(legacy);
      assert.equal((await service.loadFavorites(migrated.id)).length, 1);
      assert.equal((await service.loadHistory(migrated.id)).length, 1);
      assert.equal(storage.has("users_db"), false);
      await service.authenticate(legacy);
      assert.equal((await service.loadFavorites(migrated.id)).length, 1);
      await service.deleteUser(migrated.id);
      storage.set("users_db", JSON.stringify([legacy]));
      await assert.rejects(service.authenticate(legacy));
    });
    await t.test("missing records return a distinguishable error", async () => {
      await assert.rejects(service.getMovie("missing-movie"), (error) => error.status === 404);
    });
    await t.test("catalog recovers after a server error", async () => {
      failPath = "/movies";
      await service.retryMovies();
      assert.ok(service.getMoviesSnapshot().error);
      assert.equal(service.getMoviesSnapshot().loading, false);
      failPath = null;
      await service.retryMovies();
      assert.equal(service.getMoviesSnapshot().error, "");
    });
    await t.test("failed migration retains the legacy copy and resumes after recovery", async () => {
      const legacy = { email: "retry@example.com", name: "Retry", password: "123" };
      storage.set("users_db", JSON.stringify([legacy]));
      storage.set(`fav_${legacy.email}`, JSON.stringify([movie]));
      failPath = "/favorites";
      const result = await service.authenticate(legacy);
      assert.ok(result.warning);
      assert.ok(storage.has(`fav_${legacy.email}`));
      assert.ok(storage.has("users_db"));
      failPath = null;
      assert.equal((await service.authenticate(legacy)).warning, "");
      assert.equal((await service.loadFavorites(result.user.id)).length, 1);
      assert.equal(storage.has(`fav_${legacy.email}`), false);
    });
    assert.equal(await readFile("db.json", "utf8"), original);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    await rm(directory, { recursive: true, force: true });
    delete globalThis.localStorage;
    delete globalThis.window;
  }
});
