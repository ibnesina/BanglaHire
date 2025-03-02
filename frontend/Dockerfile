# Use a Node image that matches your Next.js version requirements (e.g., Node 16)
FROM node:bookworm

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh


# Build the Next.js app
RUN npm run build

# Expose port (default for Next.js is 3000)
EXPOSE 3000


ENTRYPOINT ["docker-entrypoint.sh"]
