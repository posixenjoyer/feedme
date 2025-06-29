ALTER TABLE "followed_feeds" RENAME TO "articles";--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT "followed_feeds_feed_id_url_unique";--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT "followed_feeds_feed_id_feeds_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_follows" ADD COLUMN "lastChecked" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "lastChecked";--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_feed_id_url_unique" UNIQUE("feed_id","url");