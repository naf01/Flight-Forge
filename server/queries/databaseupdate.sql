CREATE OR REPLACE FUNCTION IsStringInArray(
    v_array varchar(10)[],
    v_string varchar(10)
) RETURNS BOOLEAN AS $$
DECLARE
    v_found BOOLEAN := FALSE;
    v_element varchar(18);
BEGIN
	RAISE NOTICE 'target: %', v_string;
    FOR v_element IN SELECT unnest(v_array) LOOP
		-- RAISE NOTICE 'elm: %', v_element;
		-- RAISE NOTICE 'misssed: %', upper(v_string);
        IF upper(v_string) = UPPER(v_element) THEN
			RAISE NOTICE 'found: %', v_element;
            v_found := TRUE;
            EXIT;
        END IF;
    END LOOP;

    -- Return the result
    RETURN v_found;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION GetDayName(input_date DATE) RETURNS VARCHAR AS $$
DECLARE
    base_date DATE := '2024-01-01'; -- January 1, 2024, is Monday
    day_names VARCHAR[] := ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days_diff INTEGER;
    day_index INTEGER;
    result_day VARCHAR(10);
BEGIN
    -- Calculate the difference in days between the input date and the base date
    days_diff := input_date - base_date;
    
    -- Calculate the index of the day name based on the difference
    day_index := (days_diff % 7 + 1) - 1;
    
    -- Assign the corresponding day name from the array
    result_day := day_names[day_index + 1];
    
    -- Return the calculated day name
    RETURN result_day;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION IsAvailableChangeAirplane(
    v_start_route_id INTEGER,
    v_end_route_id INTEGER,
    v_start_airplane_date DATE
) RETURNS BOOLEAN AS $$
DECLARE
	v_start_airplane_id INTEGER;
    v_end_airplane_id INTEGER;
    v_start_dayname VARCHAR(10);
    v_days VARCHAR(10)[];
	v_days2 VARCHAR(10)[];
    v_start_arrival_time TIME;
    v_end_departure_time TIME;
BEGIN
	SELECT AIRPLANE_ID INTO v_start_airplane_id
	FROM ROUTE
	WHERE ID = v_start_route_id;
	
	SELECT AIRPLANE_ID INTO v_end_airplane_id
	FROM ROUTE
	WHERE ID = v_end_route_id;

    v_start_dayname := GetDayName(v_start_airplane_date);
    RAISE NOTICE 'v_start_dayname: %', v_start_dayname;

    SELECT days INTO v_days
    FROM airplane
    WHERE Id = v_start_airplane_id;
	
	SELECT days INTO v_days2
    FROM airplane
    WHERE Id = v_end_airplane_id;
	
    RAISE NOTICE 'v_days: %', v_days;
	RAISE NOTICE 'v_days2: %', v_days2;
	-- RAISE NOTICE 'INN: %', v_start_dayname = ANY(v_days);

	IF IsStringInArray(v_days, v_start_dayname) THEN
		RAISE NOTICE 'yay1: %', v_days;
		
        SELECT arrival_time
        INTO v_start_arrival_time
        FROM route
        WHERE id = v_start_route_id;

        SELECT departure_time
        INTO v_end_departure_time
        FROM route
        WHERE id = v_end_route_id;
		
		RAISE NOTICE 'v_end_departure_time: %', v_end_departure_time;
		RAISE NOTICE 'v_start_arrival_time: %', v_start_arrival_time;

        -- Check if second airplane's any varchar data of array matches start_dayname
        IF 1=1 THEN
            -- Check if second airplane departure time is greater than the first one's arrival time
            IF v_end_departure_time > v_start_arrival_time and v_start_dayname = any(v_days2) THEN
				RAISE NOTICE 'yay2: %', v_days;
                RETURN TRUE;
            ELSE
                -- Increase v_start_dayname value by 1 to find the next day
                SELECT (CASE 
                            WHEN v_start_dayname = 'Sunday' THEN 'Monday'
                            WHEN v_start_dayname = 'Monday' THEN 'Tuesday'
                            WHEN v_start_dayname = 'Tuesday' THEN 'Wednesday'
                            WHEN v_start_dayname = 'Wednesday' THEN 'Thursday'
                            WHEN v_start_dayname = 'Thursday' THEN 'Friday'
                            WHEN v_start_dayname = 'Friday' THEN 'Saturday'
                            ELSE 'Sunday' 
                        END) INTO v_start_dayname;

                -- Check if the second airplane's days value also holds the new v_start_dayname value
                IF v_start_dayname = any(v_days2) THEN
					RAISE NOTICE 'yay3: %', v_days;
                    -- Check if the difference between arrival time of first airplane and departure time of second airplane is greater than or equal to 18 hours
                    IF (v_start_arrival_time - v_end_departure_time) >= INTERVAL '18 hours' THEN
                        RETURN TRUE;
                    ELSE
                        RETURN FALSE;
                    END IF;
                ELSE
                    RETURN FALSE;
                END IF;
            END IF;
        ELSE
            RETURN FALSE;
        END IF;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE PLPGSQL;



-- Sample data
DO $$
DECLARE
    v_available BOOLEAN;
BEGIN
    -- Call the function with sample data
    v_available := IsAvailableChangeAirplane(
        v_start_route_id := 18,
        v_end_route_id := 19,
        v_start_airplane_date := '2024-02-23'::DATE
    );

    -- Output the result
    IF v_available THEN
        RAISE NOTICE 'The airplane change is available.';
    ELSE
        RAISE NOTICE 'The airplane change is not available.';
    END IF;
END;
$$;

select * from route;







-- IsAvailableChangeAirplane Function
CREATE OR REPLACE FUNCTION IsAvailableChangeAirplane(
    v_start_route_id INTEGER,
    v_end_route_id INTEGER,
    v_start_airplane_date DATE
) RETURNS TABLE(result BOOLEAN, updated_date DATE) AS $$
DECLARE
    v_start_airplane_id INTEGER;
    v_end_airplane_id INTEGER;
    v_start_dayname VARCHAR(10);
    v_days VARCHAR(10)[];
    v_days2 VARCHAR(10)[];
    v_start_arrival_time TIME;
    v_end_departure_time TIME;
BEGIN
    SELECT AIRPLANE_ID INTO v_start_airplane_id
    FROM ROUTE
    WHERE ID = v_start_route_id;
    
    SELECT AIRPLANE_ID INTO v_end_airplane_id
    FROM ROUTE
    WHERE ID = v_end_route_id;

    v_start_dayname := GetDayName(v_start_airplane_date);

    SELECT days INTO v_days
    FROM airplane
    WHERE Id = v_start_airplane_id;
    
    SELECT days INTO v_days2
    FROM airplane
    WHERE Id = v_end_airplane_id;

    IF IsStringInArray(v_days, v_start_dayname) THEN
        SELECT arrival_time
        INTO v_start_arrival_time
        FROM route
        WHERE id = v_start_route_id;

        SELECT departure_time
        INTO v_end_departure_time
        FROM route
        WHERE id = v_end_route_id;

        IF v_end_departure_time > v_start_arrival_time and v_start_dayname = any(v_days2) THEN
            -- Return true if airplane change is available, along with the updated date
            RETURN QUERY SELECT true, v_start_airplane_date;
        ELSE
            -- Return false if airplane change is not available, along with the updated date
            RETURN QUERY SELECT false, v_start_airplane_date;
        END IF;
    ELSE
        -- Return false if airplane change is not available, along with the updated date
        RETURN QUERY SELECT false, v_start_airplane_date;
    END IF;
END;
$$ LANGUAGE PLPGSQL;


-- FindTransit Function
CREATE OR REPLACE FUNCTION FindTransit(
    v_start_airport_id INTEGER,
    v_end_airport_id INTEGER,
    v_start_airplane_date DATE
) RETURNS TABLE (
    P1_START INTEGER,
    P1_END INTEGER,
    P2_END INTEGER
) AS $$
DECLARE
    v_route1 RECORD;
    v_route2 RECORD;
    route_result RECORD; -- Define a record variable for the loop result
BEGIN
    -- Find the first route matching the start airport ID and transit ending at the end airport ID
    FOR v_route1 IN 
        SELECT R1.*
        FROM ROUTE R1
        WHERE R1.START_AIRPORT_ID = v_start_airport_id
        AND (R1.END_AIRPORT_ID = v_end_airport_id OR EXISTS (
            SELECT 1
            FROM ROUTE R2
            WHERE R2.START_AIRPORT_ID = R1.END_AIRPORT_ID
            AND R2.END_AIRPORT_ID = v_end_airport_id
        ))
    LOOP
        FOR v_route2 IN 
            SELECT R2.*
            FROM ROUTE R2
            WHERE R2.START_AIRPORT_ID = v_route1.END_AIRPORT_ID
            AND (R2.END_AIRPORT_ID = v_end_airport_id OR EXISTS (
                SELECT 1
                FROM ROUTE R3
                WHERE R3.START_AIRPORT_ID = R2.END_AIRPORT_ID
                AND R3.END_AIRPORT_ID = v_end_airport_id
            ))
        LOOP
            -- Check airplane availability
            FOR route_result IN
                SELECT * FROM IsAvailableChangeAirplane(v_route1.ID, v_route2.ID, v_start_airplane_date)
            LOOP
                -- Return the transit path if airplane change is available
                RETURN QUERY SELECT v_route1.START_AIRPORT_ID, v_route1.END_AIRPORT_ID, v_route2.END_AIRPORT_ID;
            END LOOP;
        END LOOP;
    END LOOP;

    -- If no transit is found, return empty
    IF NOT FOUND THEN
        RETURN;
    END IF;
END;
$$ LANGUAGE PLPGSQL;





-- Test the FindTransit function
SELECT * FROM FindTransit(2, 5, '2024-02-23'::DATE);
