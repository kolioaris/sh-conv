FROM python:3.12-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libvips-dev \
    imagemagick \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# ── Build Next.js frontend ──
FROM base AS frontend-builder
WORKDIR /app/frontend
ENV PATH="/root/.bun/bin:$PATH"
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ ./
RUN bun run build

# ── Final image ──
FROM base AS runner
WORKDIR /app
ENV PATH="/root/.bun/bin:$PATH"

# Copy Python backend
COPY backend/ ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy built Next.js
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

ARG PORT=3000
ARG BACKEND_PORT=8000
EXPOSE $PORT $BACKEND_PORT

CMD ["./start.sh"]
