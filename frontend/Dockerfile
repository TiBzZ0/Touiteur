# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source files and build the Next.js app
COPY . .
RUN npm run build

# Use a lightweight image to serve the built app
FROM node:${NODE_VERSION}-alpine AS runner

# Set working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/package.json /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules

RUN mkdir -p /usr/src/app/public/uploads && \
    chown -R node:node /usr/src/app/public/uploads

# Expose the port that the Next.js app listens on
EXPOSE 8080

# Set environment variable for production
ENV NODE_ENV=production

# Run the Next.js app
CMD ["npm", "start"]
