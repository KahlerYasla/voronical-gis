WITH market_location AS (
    SELECT geom
    FROM markets
    WHERE id = 20
),
market_edge AS (
    SELECT id,
        source,
        target,
        the_geom,
        ST_Distance(the_geom, ml.geom) AS dist
    FROM edges,
        market_location ml
    ORDER BY ml.geom <->the_geom
    LIMIT 1
), user_location AS (
    SELECT ST_SetSRID(ST_MakePoint(29.007087, 41.042127), 4326) AS geom
),
user_edge AS (
    SELECT id,
        source,
        target,
        the_geom,
        ST_Distance(the_geom, ul.geom) AS dist
    FROM edges,
        user_location ul
    ORDER BY ul.geom <->the_geom
    LIMIT 1
), path_edges AS (
    SELECT e.id,
        e.source,
        e.target,
        d.seq,
        ST_StartPoint(e.the_geom) AS start_geom,
        ST_EndPoint(e.the_geom) AS end_geom
    FROM pgr_dijkstra(
            'SELECT id, source, target, cost FROM edges',
            (
                SELECT source
                FROM market_edge
            ),
            (
                SELECT target
                FROM user_edge
            ),
            directed := false
        ) AS d
        JOIN edges AS e ON d.edge = e.id
    ORDER BY d.seq
),
start_points AS (
    SELECT seq,
        ST_X(start_geom) AS longitude,
        ST_Y(start_geom) AS latitude,
        start_geom AS geom
    FROM path_edges
),
end_points AS (
    SELECT seq + 0.5 AS seq,
        ST_X(end_geom) AS longitude,
        ST_Y(end_geom) AS latitude,
        end_geom AS geom
    FROM path_edges
)
SELECT row_number() OVER () AS uid,
    seq,
    latitude,
    longitude,
    geom
FROM (
        SELECT *
        FROM start_points
        UNION ALL
        SELECT *
        FROM end_points
    ) AS points
ORDER BY seq;
select *
from markets ---
    ---- Calculate a score for each market based on rating and review_count
    WITH market_scores AS (
        SELECT id,
            name,
            types,
            rating,
            review_count,
            (rating * 0.7) + (LOG(review_count + 1) * 0.3) AS score
        FROM markets
    ),
    -- Find the average score for all markets
    avg_score AS (
        SELECT AVG(score) AS average_score
        FROM market_scores
    ) -- Select markets with scores below the average, sorted by score
SELECT id,
    name,
    types,
    rating,
    review_count,
    score
FROM market_scores
WHERE score < (
        SELECT average_score
        FROM avg_score
    )
ORDER BY score;