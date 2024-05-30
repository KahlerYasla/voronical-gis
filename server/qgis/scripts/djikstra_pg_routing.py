import psycopg2

# Database connection details
dbname = "term_project"
dbuser = "kahler"
dbpassword = "3755"

# Function to execute a SQL query and return the results
def execute_query(query):
  conn = psycopg2.connect(dbname=dbname, user=dbuser, password=dbpassword)
  cur = conn.cursor()
  cur.execute(query)
  rows = cur.fetchall()
  conn.close()
  return rows

# Get starting point coordinates
start_long, start_lat = 41.043, 29.008  # Replace with your starting point coordinates

# Get market IDs to visit (comma-separated list)
market_ids = "1,2,3"  # Replace with your list of market IDs

# 1. Find closest market to starting point
closest_market_query = f"""
SELECT id, geom
FROM markets
ORDER BY st_dwithin(geom, ST_GeomFromText('POINT({start_long} {start_lat})', 4326)) LIMIT 1;
"""
closest_market = execute_query(closest_market_query)[0]

# 2. Create temporary table to store visit order
create_temp_table = """
CREATE TEMPORARY TABLE visit_order (
  id SERIAL PRIMARY KEY,
  market_id INTEGER REFERENCES markets(id),
  sequence_number INTEGER
);
"""
execute_query(create_temp_table)

# 3. Insert starting market and remaining markets
insert_start_market = f"""
INSERT INTO visit_order (market_id, sequence_number)
VALUES ({closest_market[0]}, 1);
"""
execute_query(insert_start_market)

insert_remaining_markets = f"""
INSERT INTO visit_order (market_id, sequence_number)
SELECT id, (sequence_number % {len(market_ids.split(',')) + 1}) + 1
FROM markets
WHERE id IN ({market_ids})
ORDER BY st_dwithin(geom, ST_GeomFromText('POINT({start_long} {start_lat})', 4326));
"""
execute_query(insert_remaining_markets)

# 4. Calculate total route distance using a loop
total_distance = 0.0
current_market_id = closest_market[0]

for i in range(2, len(market_ids.split(',')) + 2):
  # Get next market to visit based on sequence
  next_market_query = f"""
  SELECT m.id, m.geom
  FROM markets m
  JOIN visit_order vo ON m.id = vo.market_id
  WHERE vo.sequence_number = {i};
  """
  next_market = execute_query(next_market_query)[0]

  # Calculate distance between current and next market
  distance_query = f"""
  SELECT st_distance(m1.geom, m2.geom)
  FROM markets m1, markets m2
  WHERE m1.id = {current_market_id} AND m2.id = {next_market[0]};
  """
  distance = execute_query(distance_query)[0][0]
  total_distance += distance

  current_market_id = next_market[0]

# 5. (Optional) Get route geometry using waypoints
waypoint_list = [closest_market[0]] + [m[0] for m in execute_query(f"SELECT id FROM markets WHERE id IN ({market_ids})")]
waypoint_query = f"""
SELECT ST_AsGeoJSON(pgr_dijkstra(
  'SELECT id AS id, source, target, cost AS length FROM roads',
  {waypoint_list[0]},
  {waypoint_list[-1]},
  directed := true
)) AS route_geom;
"""
route_geom = execute_query(waypoint_query)[0][0]

# 6. Drop temporary table
drop_temp_table = "DROP TABLE visit_order;"
execute_query(drop_temp_table)

# Print results (modify as needed)
print(f"Total distance: {total_distance} meters")
print(f"Route geometry: {route_geom}")