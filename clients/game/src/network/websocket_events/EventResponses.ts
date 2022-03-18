/**
 * A list of the functions to run for each event response from the server.
 * Each response can be given a generic `data` object as a parameter.
 */
const eventResponses: {[key: string]: (data: any) => void} = {};

export default eventResponses;
