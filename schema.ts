export const schema = `#graphql

    type Restaurante{
        nombre: String!
        direccion: String!
        ciudad: String!
        telefono: String!
    }
    type Query {
        getRestaurant(id:ID!): Restaurante!
        getRestaurants: [Restaurante!]!
    }
    type Mutation{
        addRestaurant(nombre:String!, direccion:String!, ciudad:String!, telefono:String!): Restaurante!
        deleteRestaurant(id:ID!): Boolean!
    }
`;
