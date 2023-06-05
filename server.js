const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');

const { ApolloServer } = require('@apollo/server');
const cors = require('cors');
const { json } = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');

const port = 3000;

const loadedFiles = loadFilesSync("**/*", {
  extensions: ['graphql']
});

const loadedResolvers = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));

async function startApolloServer() {
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs: loadedFiles,
    resolvers: loadedResolvers
  });

  const server = new ApolloServer({
    schema
  });

  await server.start();

  app.use('/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token })
    })
  );

  app.listen(port, () => {
    console.log(`Running a GraphQL API server...`);
  })
}

startApolloServer();