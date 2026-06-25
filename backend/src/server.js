import app from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`ElectroCables API prepared on http://localhost:${env.PORT}`);
});
