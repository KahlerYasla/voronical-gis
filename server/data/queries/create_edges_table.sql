-- Step 1: Create the edges Table
CREATE TABLE edges (
    id SERIAL PRIMARY KEY,
    source INTEGER,
    target INTEGER,
    cost DOUBLE PRECISION,
    reverse_cost DOUBLE PRECISION,
    the_geom GEOMETRY(LineString, 4326)
);
CREATE INDEX edges_source_idx ON edges (source);
CREATE INDEX edges_target_idx ON edges (target);
CREATE INDEX edges_the_geom_idx ON edges USING GIST (the_geom);
-- Step 2: Split MultiLineString into LineString and Insert into Temporary Table
CREATE TABLE temp_edges AS
SELECT nextval('edges_id_seq') AS id,
    (ST_Dump(geom)).geom AS the_geom
FROM roads;
-- Ensure each geometry is a LineString
DELETE FROM temp_edges
WHERE GeometryType(the_geom) != 'LINESTRING';
-- Add columns to temp_edges
ALTER TABLE temp_edges
ADD COLUMN source INTEGER;
ALTER TABLE temp_edges
ADD COLUMN target INTEGER;
ALTER TABLE temp_edges
ADD COLUMN cost DOUBLE PRECISION;
ALTER TABLE temp_edges
ADD COLUMN reverse_cost DOUBLE PRECISION;
-- Step 3: Create the vertices Table
CREATE TABLE vertices (
    id SERIAL PRIMARY KEY,
    the_geom GEOMETRY(Point, 4326)
);
-- Insert unique start and end points into the vertices table
INSERT INTO vertices (the_geom)
SELECT ST_StartPoint(the_geom)
FROM temp_edges
UNION
SELECT ST_EndPoint(the_geom)
FROM temp_edges;
-- Index the vertices table
CREATE INDEX vertices_geom_idx ON vertices USING GIST (the_geom);
-- Step 4: Populate source and target columns using the vertices table
UPDATE temp_edges
SET source = v.id
FROM vertices v
WHERE ST_Equals(ST_StartPoint(temp_edges.the_geom), v.the_geom);
UPDATE temp_edges
SET target = v.id
FROM vertices v
WHERE ST_Equals(ST_EndPoint(temp_edges.the_geom), v.the_geom);
-- Step 5: Calculate Cost and Reverse Cost
-- Calculate cost based on the length of the line
UPDATE temp_edges
SET cost = ST_Length(the_geom);
-- For simplicity, set reverse_cost equal to cost
-- You may adjust this based on your network characteristics
UPDATE temp_edges
SET reverse_cost = cost;
-- Step 6: Populate the edges Table
-- Insert data into edges table
INSERT INTO edges (source, target, cost, reverse_cost, the_geom)
SELECT source,
    target,
    cost,
    reverse_cost,
    the_geom
FROM temp_edges;
-- Clean up temporary tables
DROP TABLE temp_edges;
DROP TABLE vertices;