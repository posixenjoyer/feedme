CREATE TABLE "followed_feeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"lastChecked" timestamp DEFAULT now() NOT NULL,
	"url" text NOT NULL,
	"feed_id" uuid,
	CONSTRAINT "followed_feeds_feed_id_url_unique" UNIQUE("feed_id","url")
);
--> statement-breakpoint
ALTER TABLE "followed_feeds" ADD CONSTRAINT "followed_feeds_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;