-- Define the given location as a point geometry (example coordinates: latitude and longitude)
WITH given_location AS (
    SELECT ST_SetSRID(ST_MakePoint(29.007087, 41.042127), 4326) AS geom
) -- Find the closest market
SELECT m.id,
    m.name,
    m.geom,
    ST_Distance(given_location.geom, m.geom) AS distance
FROM markets m,
    given_location
ORDER BY distance
LIMIT 1;