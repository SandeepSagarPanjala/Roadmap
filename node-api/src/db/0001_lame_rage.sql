CREATE TABLE "exoplanets" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"scientific_name" varchar(100),
	"image_url" text,
	"discovered_on" date,
	"discovered_by" varchar(255),
	"distance_from_earth_ly" numeric(15, 2),
	"solar_system_name" varchar(100) DEFAULT 'Unknown',
	"lead_researcher_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "exoplanets_scientific_name_key" UNIQUE("scientific_name")
);
--> statement-breakpoint
ALTER TABLE "exoplanets" ADD CONSTRAINT "exoplanets_lead_researcher_id_fkey" FOREIGN KEY ("lead_researcher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;