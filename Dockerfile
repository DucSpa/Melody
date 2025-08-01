FROM node:20

WORKDIR /app

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of your app's code
COPY . .

CMD ["node", "src/index.js"]