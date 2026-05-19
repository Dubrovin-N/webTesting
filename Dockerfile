# Use the official Playwright image as the base image
FROM mcr.microsoft.com/playwright:v1.58.2-noble

# Set the working directory inside the container
WORKDIR /app

# Copy the package manifest files for dependency installation
COPY package*.json ./

# Clean installation of all project dependencies
RUN npm ci

# Copy the rest of the project code (excluding what's in .dockerignore)
COPY . .

# Default command that will run when the container starts
CMD ["npx", "playwright", "test"]