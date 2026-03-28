import { builder } from '../builder.js';
import { exoplanets } from '../../db/schema.js';
import { getAllExoplanets, addExoplanet } from '../../services/exoplanetService.js';
import { GraphQLResolveInfo } from 'graphql';

export type ExoplanetType = typeof exoplanets.$inferSelect;

// 1. The Secure Menu Object
export const ExoplanetObject = builder.objectRef<ExoplanetType>('Exoplanet').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    scientificName: t.exposeString('scientificName', { nullable: true }),
    imageUrl: t.exposeString('imageUrl', { nullable: true }),
    discoveredOn: t.exposeString('discoveredOn', { nullable: true }),
    discoveredBy: t.exposeString('discoveredBy', { nullable: true }),
    distanceFromEarthLy: t.exposeString('distanceFromEarthLy', { nullable: true }),
    solarSystemName: t.exposeString('solarSystemName', { nullable: true }),
    leadResearcherId: t.exposeString('leadResearcherId', { nullable: true }),
  }),
});

// 2. Attach Resolvers
builder.queryFields((t) => ({
  getAllExoplanets: t.field({
    type: [ExoplanetObject],
    resolve: async (parent, args, ctx, info: GraphQLResolveInfo) => {
      // FOR THE LOVE OF OPTIMIZATION!
      const requestedFields = info.fieldNodes[0].selectionSet?.selections.map(
        (selection: any) => selection.name.value
      ) || [];
      
      const planets = await getAllExoplanets(requestedFields);
      return planets as ExoplanetType[];
    }
  })
}));

import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../../constants/messages.js';

// 3. Attach Mutations (Creating New Data)
builder.mutationFields((t) => ({
  addExoplanet: t.field({
    type: ExoplanetObject,
    args: {
      name: t.arg.string({ 
        required: true,
        validate: z.string().min(2, VALIDATION_MESSAGES.EXOPLANET.NAME_MIN)
      }),
      scientificName: t.arg.string({ required: false }),
      imageUrl: t.arg.string({ 
        required: false,
        validate: z.string().url(VALIDATION_MESSAGES.EXOPLANET.URL_INVALID).optional()
      }),
      discoveredOn: t.arg.string({ required: false }),
      discoveredBy: t.arg.string({ required: false }),
      distanceFromEarthLy: t.arg.string({ 
        required: false,
        // Proving Regex protection explicitly blocks alphanumeric hacks instantly
        validate: z.string().regex(/^\d+(\.\d+)?$/, VALIDATION_MESSAGES.EXOPLANET.DISTANCE_INVALID).optional()
      }),
      solarSystemName: t.arg.string({ required: false }),
      leadResearcherId: t.arg.string({ 
        required: false,
        validate: z.string().uuid(VALIDATION_MESSAGES.EXOPLANET.RESEARCHER_ID_INVALID).optional()
      }),
    },
    authScopes: { auth: true }, // Mathematically restricts any unauthenticated inserts globally!
    resolve: async (parent, args, ctx) => {
      // Hands the strictly-typed arguments directly to the Drizzle Chef!
      const newPlanet = await addExoplanet({
        name: args.name,
        scientificName: args.scientificName,
        imageUrl: args.imageUrl,
        discoveredOn: args.discoveredOn,
        discoveredBy: args.discoveredBy,
        distanceFromEarthLy: args.distanceFromEarthLy,
        solarSystemName: args.solarSystemName,
        leadResearcherId: args.leadResearcherId,
      });
      return newPlanet;
    }
  })
}));
