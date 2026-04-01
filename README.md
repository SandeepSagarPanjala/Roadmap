# Roadmap

# Find and kill on ports

% lsof -i :3000
kill -9 $(lsof -t -i:3000)

# NGINX

sudo brew services start nginx
sudo brew services start nginx-ui
sudo brew services stop nginx
sudo brew services stop nginx-ui

# PM2 install

app.pm2.io
pm2 link qilc0fxdc0gipun 4o561qhy9dhit55
pm2 start dist/index.js --name node-api
pm2 save

# PM2 Restart

git pull
pnpm install
pnpm run build
pm2 restart node-api

# Problems

n + 1 problem
