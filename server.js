const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { graphqlHTTP } = require('express-graphql');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');

const app = express();
const port = 3000;

const loadedFiles = loadFilesSync("**/*", {
  extensions: ['graphql']
});

const loadedResolvers = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));

const schema = makeExecutableSchema({
  typeDefs: loadedFiles,
  resolvers: loadedResolvers
  // resolvers: {
  //   Query: {
  //     posts: async (parent, args, context, info) => {
  //       const product = await Promise.resolve(parent.posts);
  //       return product;
  //     },
  //     comments: async (parent) => {
  //       const comment = await Promise.resolve(parent.comments);
  //       return comment;
  //     }
  //   }
  // }
});

// const root = {
//   posts: require('./posts/posts.model'),
//   comments: require('./comments/comments.model')
// };

app.use('/graphql', graphqlHTTP({
  schema: schema,
  // rootValue: root,
  graphiql: true
}));

app.listen(port, () => {
  console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);
});