# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


CORREOS
=======

plataformas.web.cl@gmail.com //OFICIAL
plataformas.web.contacto@gmail.com //CONTACTO



ANOTACIONES
===========
Password Example (Comando Git): node hashea.js admin 1234
Shift + Alt + F (Ordenar Código)

INSTALAR EN CONSOLA:
// npm install react-ga4
// npm install googleapis
LUEGO PARA NETLIFY, Consumir API GOOGLE:
// npm install netlify-cli -g
// netlify functions:create getAnalyticsStats

AMAZON S3
// npm install aws-sdk

BUCKET POLITICAS BUCKET:
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicReadAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::plataformas-web-buckets/*"
        }
    ]
}
BUCKET RECURSOS CORS:
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]

TRANSBANK
=========

TEST: netlify dev
npm install transbank-sdk

npm install -g ngrok
ngrok http 8888

npm install connect-history-api-fallback --save-dev
REGISTRARSE COMO CLIENTE PARA INGRESAR BANCO transbank.cl

COMANDOS
========

Node: npm run dev - npm run build

Correr hosting: netlify dev

Kill puerto: npx kill-port 5174

REVISAR INSTALADO: npm install @google-analytics/data
AUTORIZAR NETLIFY: netlify deploy --prod

API NETLIFY: npx netlify functions:serve getAnalyticsStats

CORRER SERVICIOS: npx netlify dev


