# GitHub Actions Configuration
# This file ensures proper deployment configuration

# Required secrets in GitHub repository settings:
# SERVER_HOST=trespuntoscomunicacion.es
# SERVER_USER=cursor
# SERVER_PASSWORD=5#!OWwzue465&OO(N5
# SERVER_PORT=22

# Deployment process:
# 1. Build the React application
# 2. Copy .htaccess file for Apache configuration
# 3. Create deployment package
# 4. Upload to server via SCP
# 5. Extract files on server
# 6. Set proper permissions
# 7. Verify deployment

# Server directory structure:
# /home/tres/db-clientes/
# ├── index.html
# ├── .htaccess
# └── assets/
#     ├── index-*.js
#     └── index-*.css

# URL: https://trespuntoscomunicacion.es/db-clientes/
