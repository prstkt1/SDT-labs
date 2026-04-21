#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "Будь ласка, запустіть цей скрипт з правами sudo: sudo ./deploy.sh"
  exit
fi



apt update
apt install -y postgresql postgresql-contrib nginx git curl


curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs


sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'notespasword123';"
sudo -u postgres createdb notes_db 2>/dev/null || echo "База notes_db вже існує."


if ! id "mywebapp" &>/dev/null; then
    useradd -r -s /bin/false mywebapp
fi


if [ -d "/opt/mywebapp" ]; then
    cd /opt/mywebapp || exit 1
    git pull
else
    git clone https://github.com/prstkt1/SDT-labs.git /opt/mywebapp
    cd /opt/mywebapp || exit 1
fi

npm install
npm run build


chown -R mywebapp:mywebapp /opt/mywebapp


mkdir -p /etc/mywebapp
cat > /etc/mywebapp/config.json <<EOF
{
  "port": 5200,
  "db": {
    "user": "postgres",
    "host": "localhost",
    "database": "notes_db",
    "password": "notespasword123",
    "port": 5432
  }
}
EOF
chown -R mywebapp:mywebapp /etc/mywebapp


cat > /etc/systemd/system/mywebapp.service <<EOF
[Unit]
Description=My Notes Web Application
After=network.target postgresql.service

[Service]
Type=simple
User=mywebapp
Group=mywebapp
WorkingDirectory=/opt/mywebapp
ExecStartPre=/usr/bin/node /opt/mywebapp/dist/migrate.js
ExecStart=/usr/bin/node /opt/mywebapp/dist/app.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable mywebapp
systemctl restart mywebapp


cat > /etc/nginx/sites-available/mywebapp <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5200;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF


ln -sf /etc/nginx/sites-available/mywebapp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

systemctl restart nginx
