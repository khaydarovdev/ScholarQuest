
import 'dotenv/config';
import { createApp } from './app.js';
import { ensureBootstrapData } from './lib/bootstrap.js';

const app = createApp();
const port = Number(process.env.PORT ?? 4000);

await ensureBootstrapData();

app.listen(port, () => {
  console.log(`ScholarQuest API listening on http://localhost:${port}`);
});
