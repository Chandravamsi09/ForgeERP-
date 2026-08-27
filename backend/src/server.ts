import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 ForgeERP Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
