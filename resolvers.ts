import type { RestaurantModel } from "./types.ts";
import { Collection, ObjectId } from "mongodb";
import { APIPhone } from "./types.ts";
import { GraphQLError } from "graphql";
import { graphql } from "graphql";

type Context = {
    coleccionRestaurantes: Collection<RestaurantModel>;
};

type getRestaurantParams = {
    id: string;
};

type addRestaurantParams = {
    nombre: string;
    direccion: string;
    ciudad: string;
    telefono: string;
};

type deleteRestaurant = {
    id: number;
};

export const resolvers = {
    Query: {
        getRestaurants: async (
            _: unknown,
            __: unknown,
            contexto: Context,
        ): Promise<RestaurantModel[]> => {
            const restaurante = await contexto.coleccionRestaurantes.find()
                .toArray();
            return restaurante;
        },
        getRestaurant: async (
            _: unknown,
            params: getRestaurantParams,
            contexto: Context,
        ): Promise<RestaurantModel | null> => {
            const restaurante = await contexto.coleccionRestaurantes.findOne({
                _id: new ObjectId(params.id),
            });
            return restaurante;
        },
    },
    Mutation: {
        addRestaurant: async (
            _: unknown,
            params: addRestaurantParams,
            contexto: Context,
        ): Promise<RestaurantModel> => {
            const API_KEY = Deno.env.get("API_KEY");
            if (!API_KEY) throw new GraphQLError("falta la apikey");
            const { nombre, direccion, ciudad, telefono } = params;
            const existsPhone = await contexto.coleccionRestaurantes
                .countDocuments({ telefono });
            if (existsPhone >= 1) {
                throw new GraphQLError("telefono ya usado");
            }
            const url =
                `https://api.api-ninjas.com/v1/validatephone?number=${telefono}`;
            const data = await fetch(url, {
                Headers: {
                    "X-Api-Key": API_KEY,
                },
            });
            /*if (data.status !== 200) {
                throw new GraphQLError("error al acceder a la data de la api");
            }*/
            const response: APIPhone = await data.json();
            if (response.is_valid === false) {
                throw new GraphQLError("el telefono introducido es incorrecto");
            }
            const country = response.country;
            const timezone = response.timezones[0];

            const { insertedId } = await contexto.coleccionRestaurantes
                .insertOne({ nombre, direccion, ciudad, telefono });

            return {
                _id: insertedId,
                nombre,
                direccion,
                ciudad,
                telefono,
            };
        },
        deleteRestaurant: async (
            _: unknown,
            params: deleteRestaurant,
            contexto: Context,
        ): Promise<Boolean> => {
            const { deletedCount } = await contexto.coleccionRestaurantes
                .deleteOne({ _id: new ObjectId(params.id) });
            return deletedCount === 1;
        },
    },
    /*Restaurante: {
        id: (parent: RestaurantModel): string => parent._id!.toString(),
        date: async (parent: RestaurantModel): Promise<string> => {
            const API_KEY = Deno.env.get("API_KEY");
            if (!API_KEY) throw new GraphQLError("falta la apikey");

            const url =
                `https://api.api-ninjas.com/v1/weather`;
            const data = await fetch(url, {
                Headers: {
                    "X-Api-Key": API_KEY,
                },
            });
            if (data.status !== 200) {
                throw new GraphQLError("error al acceder a la data de la api");
            }
            const response: APIWeather = await data.json();
            const date = response.;
            return date;
        },
    },*/
};

//https://api.api-ninjas.com/v1/worldtime?timezone=${parent.timezone}
