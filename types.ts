import { OptionalId } from "mongodb";

export type RestaurantModel = OptionalId<{
    nombre: string;
    direccion: string;
    ciudad: string;
    telefono: string;
}>;
export type APIPhone = {
    is_valid: boolean;
    country: string;
    timezones: string;
};
//export type APIWeather = {};
