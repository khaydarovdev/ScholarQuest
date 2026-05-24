# ScholarQuest

ScholarQuest is a full-stack scholarship discovery platform with:
- Vue 3 frontend
- Express + Prisma backend
- PostgreSQL database
- JWT auth with refresh tokens
- scholarship discovery, matching, stories, alumni, guides, and tracking

## Local development

1. Install dependencies
   ```bash
   npm install
   ```

2. Set up `server/.env`
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/scholarquest"
   JWT_ACCESS_SECRET="change-me"
   JWT_REFRESH_SECRET="change-me-too"
   CLIENT_URL="http://localhost:5173"
   PORT=4000
   ```

3. Set up `client/.env`
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

4. Create the database, then run:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   npm run dev
   ```

## Troubleshooting

- If signup/login fails, make sure the backend is running and `DATABASE_URL` points to a real PostgreSQL database.
- If no scholarships or alumni appear, rerun the seed command.
- If the frontend cannot reach the API, check `VITE_API_URL` and CORS origin settings.

## Deployment

- Frontend: Cloudflare Pages
- Backend: Railway or Render
- Database: Supabase PostgreSQL
- Domain/DNS: Namecheap + Cloudflare
# ScholarQuest
