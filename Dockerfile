# Use the official Node.js image with a recent version (16.x or later).
FROM node:16

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Expose the port the app runs on
EXPOSE 3000

RUN npm run build

# Run the web service on container startup.
CMD ["npm", "run", "start:prod"]
