-- Drop the view if it exists
DROP VIEW IF EXISTS market_voronoi_view;
-- Create the view
CREATE VIEW market_voronoi_view AS WITH voronoi AS (
    SELECT ST_VoronoiPolygons(ST_Collect(geom)) AS geom
    FROM markets
),
-- Dump the collection into individual polygons
voronoi_dump AS (
    SELECT (ST_Dump(geom)).geom AS geom
    FROM voronoi
),
-- Assign each Voronoi polygon to the nearest market
market_voronoi AS (
    SELECT m.id AS market_id,
        m.name,
        m.types,
        m.rating,
        m.review_count,
        v.geom
    FROM markets m
        JOIN voronoi_dump v ON ST_Intersects(m.geom, v.geom)
)
SELECT *
FROM market_voronoi;