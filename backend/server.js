import app from "./src/app.js";
import runMigrations from "./src/utils/runMigrations.js";

const PORT = 5000;

const startServer = async () => {
  await runMigrations();
  app.listen(PORT,"0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

startServer();
