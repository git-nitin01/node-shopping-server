# syntax=docker/dockerfile:1.4

# Use the official Node.js image for the linux/amd64 platform
FROM --platform=$TARGETPLATFORM node:18-alpine

# Set up the working directory
WORKDIR /app

# Copy only the package.json and package-lock.json files
COPY package*.json ./
COPY .env ./

# Install dependencies
RUN npm install

# Copy the built application files
COPY dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
