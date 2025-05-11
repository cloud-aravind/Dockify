# Stage 1: Build
FROM node:18 as build
#Create a work directory
WORKDIR /app
# Copy only package files first for better caching
COPY package*.json ./
# Install only production dependencies (omit dev)
RUN npm install --omit=dev

# Stage 2: Final Lightweight Image
FROM node:alpine
#Create a work directory
WORKDIR /app
# Copy installed node_modules from build stage
COPY --from=build /app/node_modules ./node_modules
# Copy all remaining app files
COPY . .
# Expose port used by the app
EXPOSE 3000
# Start the app
CMD ["node", "server.js"]
