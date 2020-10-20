const { ApolloServer, gql } = require("apollo-server-lambda")
var faunadb = require("faunadb"),
  q = faunadb.query

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
  type Mutation {
    addBookmark(url: String!, desc: String!): Bookmark
  }
`

const resolvers = {
  Query: {
    bookmarks: async () => {
      try {
        var adminClient = new faunadb.Client({
          secret: "fnAD4WspdcACAZNBJB4bsHTdWy_AlTBNBabJNXPv",
        })
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result.data)

        return result.data.map(d => {
          return {
            id: d.ts,
            url: d.data.url,
            desc: d.data.desc,
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
  },
  Mutation: {
    addBookmark: async (_, { url, desc }) => {
      console.log("url,desc", url, desc)
      try {
        var adminClient = new faunadb.Client({
          secret: "fnAD4WspdcACAZNBJB4bsHTdWy_AlTBNBabJNXPv",
        })
        const result = await adminClient.query(
          q.Create(q.Collection("links"), {
            data: {
              url,
              desc,
            },
          })
        )
        return result.ref.data
      } catch (err) {
        console.log(err)
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
