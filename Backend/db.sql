/* this database schemas is written for PostgreSQL. The code syntax changes for Mysql,Oracle,.... */

/* table 1*/
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    pincode INTEGER NOT NULL REFERENCES zip_codes(pincode),
    blood_group VARCHAR(10) NOT NULL,
    savings VARCHAR(50) DEFAULT '₹0',
    cntsearch INTEGER DEFAULT 0,
    trust_score NUMERIC(6, 3) DEFAULT 48.000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*table 2*/
CREATE TABLE IF NOT EXISTS health_tips (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    tip TEXT NOT NULL
);

-- table 3
CREATE TABLE IF NOT EXISTS tests (
    test_id SERIAL PRIMARY KEY,
    test_name VARCHAR(512) UNIQUE NOT NULL
);

-- table 4
CREATE TABLE IF NOT EXISTS medicines(
    id SERIAL PRIMARY KEY,
    name VARCHAR(512) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    manufacturer_name VARCHAR(512) NOT NULL,
    type VARCHAR(16) NOT NULL,
    general_use VARCHAR(2048) NOT NULL,
    side_effects VARCHAR(2048)
);

-- table 5
CREATE TABLE IF NOT EXISTS zip_codes (
    pincode INTEGER PRIMARY KEY,
    divisionname VARCHAR(256),
    regionname VARCHAR(512),
    circlename VARCHAR(256)
);

-- table 6
CREATE TABLE IF NOT EXISTS user_raw_data_entries (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    pincode INTEGER NOT NULL REFERENCES zip_codes(pincode),
    test_id INT NOT NULL REFERENCES tests(test_id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    hospital_name VARCHAR(1024) default null,
    hospital_tier VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- table 7
CREATE TABLE IF NOT EXISTS daily_median_prices (
    id SERIAL PRIMARY KEY,
    pincode INTEGER NOT NULL REFERENCES zip_codes(pincode),
    test_id INT NOT NULL REFERENCES tests(test_id) ON DELETE CASCADE,
    median_price NUMERIC(10, 2) NOT NULL,
    hospital_tier VARCHAR(50) NOT NULL,
    hospital_name VARCHAR(1024) NOT NULL DEFAULT '',
    calculation_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (pincode, test_id, hospital_tier, hospital_name, calculation_date)
);

-- table 8
CREATE TABLE IF NOT EXISTS test_prices (
    id SERIAL PRIMARY KEY,
    pincode INTEGER NOT NULL REFERENCES zip_codes(pincode),
    test_id INT NOT NULL REFERENCES tests(test_id) ON DELETE CASCADE,
    price NUMERIC(10, 2) DEFAULT NULL,
    hospital_tier VARCHAR(50) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (pincode, test_id, hospital_tier)
);

-- table 9
CREATE TABLE IF NOT EXISTS user_activities (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* logics for updating the tables based on the user submitted data */

-- logic 1 to update the daily median price
/*for every unique test, pincode, tier, hospital that are recorded yesterday */
/* logic for every day 2AM update */

INSERT INTO daily_median_prices (test_id, pincode, hospital_tier, hospital_name, median_price, calculation_date, created_at)
SELECT test_id, pincode, hospital_tier, COALESCE(hospital_name, '') AS hospital_name,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) AS median_price,
       CURRENT_DATE - 1, NOW()
FROM user_raw_data_entries
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE
GROUP BY test_id, pincode, hospital_tier, hospital_name
ON CONFLICT (test_id, pincode, hospital_tier, hospital_name, calculation_date) /*if by mistake the code may run two times on a same day so, to avoid dublicate readings "on conflict" handles it */
DO UPDATE SET median_price = EXCLUDED.median_price, created_at = NOW();

-- logic 2 to update the user trust score
/* it is for the users who submitted current price (at that location, test,....)*/
/* logic 2 for every day 2AM update after daily median prices table update */

WITH 
deviations AS (
  SELECT r.user_id,
         ABS(r.price - d.median_price) / NULLIF(d.median_price, 0) * 100 AS dev_pct
  FROM user_raw_data_entries r
  JOIN daily_median_prices d
    ON r.test_id = d.test_id AND r.pincode = d.pincode AND r.hospital_tier = d.hospital_tier
    AND COALESCE(r.hospital_name,'') = COALESCE(d.hospital_name,'')
    AND d.calculation_date = CURRENT_DATE - 1
  WHERE r.created_at >= CURRENT_DATE - INTERVAL '1 day' AND r.created_at < CURRENT_DATE
),
scored AS (
  SELECT user_id,
         CASE WHEN dev_pct <= 20 THEN 4 * (1 - dev_pct/20)              -- reward: 0 to 4% if the deviation is <=20%; as the less deviation the the more +ve % (capped 4% for each submission);
              ELSE -8 * LEAST(1, (dev_pct-20)/80) END AS pts             -- penalty: 0 to -8%, if the deviation is more than 20%; the higher deviation the higher penatly (capped -8% for each submission);
  FROM deviations
),
daily_delta AS (
  SELECT user_id,
         COALESCE(LEAST(4, GREATEST(0, SUM(CASE WHEN pts>0 THEN pts END))), 0) 
       + COALESCE(GREATEST(-8, LEAST(0, SUM(CASE WHEN pts<0 THEN pts END))), 0) AS delta
  FROM scored GROUP BY user_id
)
UPDATE users u
SET trust_score = LEAST(100, GREATEST(0, trust_score + dd.delta))
FROM daily_delta dd
WHERE u.id = dd.user_id;

-- logic 3 to update the final test_prices 
/* the median of last 7 days, for the test that are listed in the daily median price table */
/* this logic for every friday 3AM after completion of logic 1, logic 2; */

INSERT INTO test_prices (test_id, pincode, hospital_tier, price, last_updated)
SELECT test_id, pincode, hospital_tier,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY median_price),
       NOW()
FROM daily_median_prices
WHERE calculation_date >= CURRENT_DATE - 7 AND calculation_date < CURRENT_DATE
GROUP BY test_id, pincode, hospital_tier
ON CONFLICT (pincode, test_id, hospital_tier)
DO UPDATE SET price = EXCLUDED.price, last_updated = NOW();