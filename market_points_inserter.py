import psycopg2
import csv

# Connect to the PostgreSQL database
conn = psycopg2.connect("dbname='postgres' user='kahler' host='localhost' password='3755'")
cur = conn.cursor()

# Open the CSV file and read data
with open('market_data.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        # Extract desired columns
        name = row.get('name')
        latitude = row.get('latitude')
        longitude = row.get('longitude')
        types = row.get('types')
        rating = row.get('rating')
        review_count = row.get('review_count')

        # Check if all required fields are present
        if name and latitude and longitude and types and rating and review_count:
            # Insert data into PostGIS table
            cur.execute("INSERT INTO markets (name, geom, types, rating, review_count) VALUES (%s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s, %s)",
                        (name, longitude, latitude, types, rating, review_count))

# Commit the transaction
conn.commit()

# Close communication with the database
cur.close()
conn.close()
