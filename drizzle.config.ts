
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './app/config/Sechma.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_uI8d3qkMpVmW@ep-quiet-frost-a4a4lug4-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  },
});
