------------------Prérequis---------------

- Node.js (v18 ou supérieur)
- npm
- MySQL (v8 ou supérieur)

--------Installation du backend------------

cd backend
npm install

--------Installation du frontend------------

cd frontend
npm install

--------Modifier le fichier .env-----------------
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=personal_finance
JWT_SECRET=un_secret_pour_le_token

-------Initialiser la base de données------------
Rendez-vous dans : backend > personal_finance.sql et exécuter le script

------------Lancement du programme------------------

1) Ouvrez 2 terminals dans VSCode:

Terminal 1 : 

cd backend
node server.js

Terminal 2

cd frontend 
npm run serv


2)Une fois cela fait, vous aurez accès au site via : 
http://localhost:5173/

3) Vous pouvez créer un nouvel utilisateur et explorer les fonctionnalités du site.
