CREATE TABLE "tag" (
                       "id" SERIAL NOT NULL,
                       "name" character varying NOT NULL,
                       CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"),
                       CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id")
);

CREATE TYPE "public"."article_status_enum" AS ENUM('published', 'draft', 'archived');

CREATE TABLE "article" (
                           "id" SERIAL NOT NULL,
                           "title" character varying NOT NULL,
                           "author" character varying NOT NULL,
                           "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                           "status" "public"."article_status_enum" NOT NULL,
                           "views" integer NOT NULL,
                           CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id")
);

CREATE TABLE "article_tags_tag" (
                                    "articleId" integer NOT NULL,
                                    "tagId" integer NOT NULL,
                                    CONSTRAINT "PK_25290137c7f85b582eea2bc470d" PRIMARY KEY ("articleId", "tagId")
);

CREATE INDEX "IDX_9b7dd28292e2799512cd70bfd8" ON "article_tags_tag" ("articleId");

CREATE INDEX "IDX_5fee2a10f8d6688bd2f2c50f15" ON "article_tags_tag" ("tagId");

ALTER TABLE "article_tags_tag"
    ADD CONSTRAINT "FK_9b7dd28292e2799512cd70bfd81"
        FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "article_tags_tag"
    ADD CONSTRAINT "FK_5fee2a10f8d6688bd2f2c50f15e"
        FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
