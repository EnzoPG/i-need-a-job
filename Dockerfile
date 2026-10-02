FROM node:20-alpine AS base

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# --- Dependencies stage ---
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci

# --- Development stage (default for local docker-compose dev) ---
FROM base AS development
WORKDIR /app
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Production Builder stage ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_INSFORGE_URL="https://yhzmui39.ap-southeast.insforge.app"
ARG NEXT_PUBLIC_INSFORGE_ANON_KEY="anon_placeholder"
ARG NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
ARG NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="placeholder"

ENV NEXT_PUBLIC_INSFORGE_URL=$NEXT_PUBLIC_INSFORGE_URL
ENV NEXT_PUBLIC_INSFORGE_ANON_KEY=$NEXT_PUBLIC_INSFORGE_ANON_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=$NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# --- Production Runner stage ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create nextjs user, create cache directory, and remove unused yarn bundle
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p .next && \
    chown nextjs:nodejs .next && \
    rm -rf /opt/yarn* /usr/local/bin/yarn*

COPY --from=builder /app/public ./public

# Leverage Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
