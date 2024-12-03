INSERT INTO tag (name)
VALUES
    ('tech'),
    ('science'),
    ('innovation')
ON CONFLICT (name) DO NOTHING;

INSERT INTO article (title, author, status, views, "createdAt")
VALUES
    ('Tech Innovations', 'Jane Doe', 'published', 150, now()),
    ('Science Breakthroughs', 'John Smith', 'published', 200, now()),
    ('Archived Thoughts', 'Jane Doe', 'archived', 50, now())
ON CONFLICT DO NOTHING;

INSERT INTO article_tags_tag ("articleId", "tagId")
SELECT
    (SELECT id FROM article WHERE title = 'Tech Innovations') AS "articleId",
    (SELECT id FROM tag WHERE name = 'tech') AS "tagId"
ON CONFLICT DO NOTHING;

INSERT INTO article_tags_tag ("articleId", "tagId")
SELECT
    (SELECT id FROM article WHERE title = 'Tech Innovations') AS "articleId",
    (SELECT id FROM tag WHERE name = 'innovation') AS "tagId"
ON CONFLICT DO NOTHING;

INSERT INTO article_tags_tag ("articleId", "tagId")
SELECT
    (SELECT id FROM article WHERE title = 'Science Breakthroughs') AS "articleId",
    (SELECT id FROM tag WHERE name = 'science') AS "tagId"
ON CONFLICT DO NOTHING;

INSERT INTO article_tags_tag ("articleId", "tagId")
SELECT
    (SELECT id FROM article WHERE title = 'Archived Thoughts') AS "articleId",
    (SELECT id FROM tag WHERE name = 'tech') AS "tagId"
ON CONFLICT DO NOTHING;
