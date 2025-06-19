ALTER TABLE "feed_follows" DROP CONSTRAINT "feed_follows_user_id_feed_id_unique";--> statement-breakpoint
ALTER TABLE "feed_follows" ADD COLUMN "linked_user_id" uuid;--> statement-breakpoint
ALTER TABLE "feed_follows" ADD CONSTRAINT "feed_follows_linked_user_id_users_id_fk" FOREIGN KEY ("linked_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_follows" ADD CONSTRAINT "feed_follows_linked_user_id_feed_id_unique" UNIQUE("linked_user_id","feed_id");