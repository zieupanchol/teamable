
# Base image that has Node.js installed
FROM node:16-alpine
# Set environment variables
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

# Create /home/app directory inside container
RUN mkdir -p /home/app

# Copy artifact into /home/app directory
COPY . /home/app

# Change into extracted package directory
WORKDIR /home/app

# Install dependencies
RUN npm install

# Specify the command to run the application
CMD ["node", "server.js"]
