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
points AS (
    SELECT seq * 2 - 1 AS seq,
        ST_X(start_geom) AS longitude,
        ST_Y(start_geom) AS latitude,
        start_geom AS geom
    FROM path_edges
)
SELECT row_number() OVER () AS seq,
    geom,
    latitude,
    longitude
FROM points
ORDER BY seq;