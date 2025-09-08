
FROM node:18-alpine
WORKDIR /programas/api-students/node
RUN npm install express sqlite3
COPY . .
RUN db.js
CMD [ "node", "app.js" ]