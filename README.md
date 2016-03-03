# SHPW

# ![SHPW](site/img/shpw-logo-text-md.png)
Self Hosted Password Manager is a simple storage system for your passwords.

##Features
- Store your passwords encrypted in a database hosted on your own server
- Clean, user-friendly and mobile-ready interface based on Bootstrap
- Add comments to your accounts
- Integrated Password Generator

##Installation
> Debian 8 with nginx

- Make sure node.js and nginx are installed
- Clone the repository with ```$ git clone https://github.com/schegar/shpw.git```
- Add this to nginx site config in the server block:
```
location /shpw {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
}
```
- In the cloned folder run ``$ npm install``
- Start server with ``$ node shpw.js`` *You can also use [PM2](https://github.com/Unitech/pm2)*
- Visit site under *http://your-ip/shpw*
 
##Screenshots
![#1](https://schegar.de/img/shpw-screenshot-main.png)

##Demo
[Working example](https://www.schegar.de/shpw/)
```
Username: test@shpw.de
Password: test
```
