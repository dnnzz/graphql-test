import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

/**
 * Create a new apollo client and export as default
 */

const typeDefs = gql`
    extend type Pet {
        vaccinated: Boolean!
    }
`
const resolvers = {
    Pet:{
        vaccinated(){
            return true
        }
    }
}
 const link = new HttpLink({uri:"http://localhost:4000"});
 const cache = new InMemoryCache();

 const client = new ApolloClient({
     link,
     cache,
     typeDefs,
     resolvers
 })

 export default client;