import { builder } from './builder.js';

// 1. We must declare the 'root' Query strictly ONCE in a massive application.
builder.queryType({});

// We must also declare the 'root' Mutation exactly ONCE for Creating/Updating data!
builder.mutationType({});

// 2. We import all of the separated files so Pothos physically registers them!
import './types/User.js';
import './types/Exoplanet.js';
import './types/Auth.js';
// import './types/Comments.js'; // Imagine importing 100 files here easily!

// 3. We let Pothos compile the entire global application into one massive RAM map.
export const schema = builder.toSchema();
