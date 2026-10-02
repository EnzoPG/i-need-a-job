# INeedAJob

AI-powered job hunting assistant with automated job discovery, AI match scoring, and deep company research.

## Getting Started (Docker First)

This project is configured **Docker-first** so you don't need to run `npm install` on your host machine. Docker manages dependencies inside isolated container volumes.

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your keys:
```bash
cp .env.example .env.local
```

### 2. Start the Application
Run the development environment using Docker Compose:
```bash
docker compose up
# or
npm run docker:dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Changes you make to files on your host machine will hot-reload automatically inside the container.

### Helpful Docker Commands
```bash
# Rebuild image after adding new dependencies to package.json
docker compose up --build

# Stop the containers
docker compose down
```

---

## Alternative: Local Node Development (Optional)
If you prefer running without Docker:
```bash
npm install
npm run dev
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
