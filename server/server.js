require("dotenv").config();
const cors = require('cors');
const morgan = require("morgan");
const express = require("express");
const port = process.env.PORT;
const db = require("./db");
const crypto = require('crypto');
const jwtGenerator = require("./utils/jwtGenerator");
const authorize = require("./middleware/authorize");
const jwt = require('jsonwebtoken');
const { start } = require("repl");

function sha256(inputString) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString, 'utf-8');
  return hash.digest('hex');
}

const app = express();

app.use(cors());
app.use(express.json());

/*app.use(morgan("dev"));

app.use((req, res, next) => {
    console.log("middle");
    next();
})*/

//passwor checker
async function comparePassword(userId, providedPassword) {

    try {
        // Fetch the password from the USER table based on the user ID
        const result = await db.query('SELECT password FROM "USER" WHERE id = $1', [userId]);
    
        if (result.rows.length === 0) {
          // User not found
          return false;
        }
    
        const storedPassword = result.rows[0].password;
    
        // Compare the stored password with the provided password
        const passwordsMatch = storedPassword === providedPassword;
    
        return passwordsMatch;
      } catch (error) {
        console.log('Error in comparePassword:');
      }
    }



// Routes requiring authentication
app.post("/api/v1/user/authenticate", async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(201).json("Authorization Denied");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        res.status(200).json("Authorized");
    } catch (err) {
        return res.status(201).json("Not Authorized");
    }
});


            // ######### USER ######### //
            // ######### USER ######### //
            // ######### USER ######### //
//signup
app.post("/api/v1/user/signup", async (req, res) => {
    try {
        console.log(req.body);
        const { first_name, last_name, dateofbirth, mobileno, password, city, country, zipcode, email } = req.body;

        // Assuming you have the sha256 function available for hashing the password
        const hashedPassword = sha256(password);

        const results = await db.query(
            `INSERT INTO APP_USER (first_name, last_name, dateofbirth, mobileno, password, city, country, zipcode, age, email)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CalculateAge($3), $9)
            RETURNING *`,
            [first_name, last_name, dateofbirth, mobileno, hashedPassword, city, country, zipcode, email]
        );

        //const jwtToken = jwtGenerator(results.rows[0].id);

        //console.log(jwtToken);

        console.log(results.rows);

        if (results.rows.length != 0) {
            const jwtToken = jwtGenerator(results.rows[0].id);
            console.log(jwtToken);
            res.status(200).json({
                status: "success",
                results: results.rows.length,
                data: {
                    token: jwtToken
                }
            });
        } else {
            res.status(201).json({
                status: "failed",
                data: {
                    flightforge: "wrong data format",
                }
            });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(201).json({ error: "Internal server error" });
    }
});

//login
app.post("/api/v1/user/login", async (req, res) => {
    try
    {
        //console.log(req.body);
        const results = await db.query("select password from APP_USER where id = $1", [req.body.id]);
        //console.log(results.rows);
        if(results.rows.length == 0)
        {
            res.status(201).json({
                status: "failed",
                data: {
                    flightforge : "wrong user id",
                }
            });
        }
        if(results.rows[0].password == sha256(req.body.password))
        {
            console.log("logged in");
            console.log("transfered id : " + req.body.id);
            const jwtToken = jwtGenerator(req.body.id);
            console.log(jwtToken);
            res.status(200).json({
                status: "success",
                results: results.rows.length,
                data: {
                    token: jwtToken
                }
            });
        }
        else
        {
            res.status(201).json({
                status: "failed",
                data: {
                    flightforge : "wrong password",
                }
            });
        }
    } catch (err){
        //console.log(err);
    }
});
//get user data
app.post("/api/v1/user/profiledata", authorize, async (req, res) => {
    try {
        //console.log(req.body);
        const { id } = req.body; // Extract parameters from query string

        if (!id) {
            return res.status(400).json({ error: 'User ID or password not provided.' });
        }

        const results = await db.query("SELECT * FROM APP_USER WHERE id = $1", [id]);

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or incorrect credentials.' });
        }

        res.status(200).json({
            status: "success",
            data: {
                user: results.rows[0] // Assuming you expect only one user based on ID
            }
        });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
//update



            // ######### ADMIN ######### //
            // ######### ADMIN ######### //
            // ######### ADMIN ######### //
//login
//signup



            // ######### Airplane_Company ######### //
            // ######### Airplane_Company ######### //
            // ######### Airplane_Company ######### //
//login
//signup //checcheckingk needed
app.post('/api/v1/airline/signup', async (req, res) => {
    try
    {
        //console.log(req.body.mobileno[1]);
        const results = await db.query("insert into airlines (name, totalplane, revenue) values ($1, 0, 0) returning *", 
                    [req.body.name, req.body.total_plae]);
        console.log(results.rows);
        if (results.rows.length == 0) res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                flightforge : results.rows,
            }
        });
        else res.status(201).json({
            status: "failed",
                data: {
                    flightforge : "wrong data format",
                }
        });
    } catch (err){
        console.log("baaal" + err);
    }
});

//adding airplanes in a airline //checking needed
app.post('/api/v1/airline/addairplane', async (req, res) => {
    try
    {
        console.log(req.body);
        const days = [];
        days = req.body.days;
        let {airline_id, airplanename, business_seat, commercial_seat, cost_per_km_business, cost_per_km_commercial, day_rate, seat_rate, luggage} = req.body;
        const results = await db.query("insert into airplane (airline_id, airplanename, days, business_seat, commercial_seat, cost_per_km_business, cost_per_km_commercial, day_rate, seat_rate, luggage) values ($1, $2, ($3), $4, $5, $6, $7, $8, $9, $10) returning *",
        [airline_id, airplanename, days, business_seat, commercial_seat, cost_per_km_business, cost_per_km_commercial, day_rate, seat_rate, luggage]);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                FlightForge : results.rows,
            }
        });
    } catch (err){
        console.log("baaal");
    }
});



            // ######### Search ######### //
            // ######### Search ######### //
            // ######### Search ######### //
//search {from, to, date}
app.post("/api/v1/searchRoute/locationn", async (req, res) => {
    try
    {
        console.log(req.body);
        const results = await db.query("SELECT P1, P2, P3, P4, ARRAY_REMOVE(ARRAY[P1_START, P1_END, P2_END, P3_END, P4_END, P5_END], NULL) AS id_array FROM ( SELECT R1.ID AS P1, R1.START_AIRPORT_ID AS P1_START, R1.END_AIRPORT_ID AS P1_END, R2.ID AS P2, R2.END_AIRPORT_ID AS P2_END, R3.ID AS P3, R3.END_AIRPORT_ID AS P3_END, R4.ID AS P4, R4.END_AIRPORT_ID AS P4_END, R5.ID AS P5, R5.END_AIRPORT_ID AS P5_END FROM ROUTE R1 LEFT OUTER JOIN ROUTE R2 ON ( R1.START_AIRPORT_ID= ( SELECT ID FROM AIRPORT WHERE LOWER(NAME) = LOWER($1) ) AND R1.END_AIRPORT_ID=R2.START_AIRPORT_ID AND R2.DEPARTURE_TIME > R1.ARRIVAL_TIME ) LEFT OUTER JOIN ROUTE R3 ON ( R2.END_AIRPORT_ID=R3.START_AIRPORT_ID AND R3.DEPARTURE_TIME > R2.ARRIVAL_TIME ) LEFT OUTER JOIN ROUTE R4 ON ( R3.END_AIRPORT_ID=R4.START_AIRPORT_ID AND R4.DEPARTURE_TIME > R3.ARRIVAL_TIME ) LEFT OUTER JOIN ROUTE R5 ON ( R4.END_AIRPORT_ID=R5.START_AIRPORT_ID AND R5.DEPARTURE_TIME > R4.ARRIVAL_TIME ) ) WHERE ( ( (P1_END) = (SELECT ID FROM AIRPORT WHERE LOWER(NAME) = LOWER($2)) OR (P2_END) = (SELECT ID FROM AIRPORT WHERE LOWER(NAME) = LOWER($2)) OR (P3_END) = (SELECT ID FROM AIRPORT WHERE LOWER(NAME) = LOWER($2)) OR (P4_END) = (SELECT ID FROM AIRPORT WHERE LOWER(NAME) = LOWER($2)) OR (P5_END) = (SELECT ID FROM AIRPORT WHERE LOWER(NAME) = LOWER($2)) ) )", [req.body.start_airport_name, req.body.end_airport_name]);
        console.log(results.rows);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                Airport : results.rows,
            }
        });
    }
    catch (err)
    {
        console.log("khida lagse");
    }
});

//Buy Ticket



app.post("/api/v1/airport/findbyname", async (req, res) => {
    try
    {
        const results = await db.query("SELECT id FROM AIRPORT WHERE upper(NAME) = upper($1)", [req.body.name]);
        res.status(200).json({
            status: "success",
            id : results.rows[0].id
        });
    } catch (err){
        res.status(201).json({
            status: "failure"
        });
    }
});

app.post("/api/v1/route/departuretime", async (req, res) => {
    try
    {
        const results = await db.query("SELECT departure_time FROM ROUTE WHERE id = $1", [req.body.route_id]);
        res.status(200).json({
            status: "success",
            time : results.rows[0].departure_time
        });
    } catch (err){
        res.status(201).json({
            status: "failure"
        });
    }
});

app.post("/api/v1/route/arrivaltime", async (req, res) => {
    try
    {
        const results = await db.query("SELECT arrival_time FROM ROUTE WHERE id = $1", [req.body.route_id]);
        res.status(200).json({
            status: "success",
            time : results.rows[0].arrival_time
        });
    } catch (err){
        res.status(201).json({
            status: "failure"
        });
    }
});

app.get("/api/v1/airports", async (req, res) => {
    try
    {
        const results = await db.query(
        "SELECT * FROM "+
        " AIRPORT"
        );
        //console.log(results.rows);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                Airport : results.rows,
            }
        });
    } catch (err){
        res.status(201).json({
            status: "failure"
        });
    }
});

//get all restaurants
app.post("/api/v1/transit", async (req, res) => {
    try{
        const results = await db.query("SELECT * FROM FindAirplaneTransitPaths($1, $2, $3::DATE, upper($4))", [req.body.start_airport_id, req.body.end_airport_id, req.body.date, req.body.seat_type]);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                Transit : results.rows,
            }
        });
    }
    catch (err){
        res.status(201).json({
            status: "failure"
        });
    }
});

app.post("/api/v1/route/seats", async (req, res ) => {
    try
    {
        let results;
        let x;
        x = await db.query("SELECT count(*) FROM SEAT_INFO WHERE route_id = $1 and journeydate = $2", [req.body.route_id, req.body.date]);
        if(!x.rows[0].count);
        {
            await db.query("INSERT INTO SEAT_INFO (route_id, journeydate, seatleft_business, seatleft_commercial, cost_business, cost_commercial) values "+
            "($1, $2, (select business_seat from airplane where id = (select airplane_id from route where id = $1)), "+
            "(select commercial_seat from airplane where id = (select airplane_id from route where id = $1)), "+
            "((select business_seat from airplane where id = (select airplane_id from route where id = $1))*(select cost_per_km_business "+
            "from airplane where id = (select airplane_id from route where id = $1))), "+
            "((select commercial_seat from airplane where id = "+
            "(select airplane_id from route where id = $1))*(select cost_per_km_commercial from airplane where id = (select airplane_id from route where id = $1))))", [req.body.route_id, req.body.date]);
        }
        if (req.body.seat_type == "commercial")
        {
            results = await db.query("SELECT seatleft_commercial FROM SEAT_INFO WHERE route_id = $1 and journeydate = $2", [req.body.route_id, req.body.date]);
            x = results.rows[0].seatleft_commercial;
        }
        else
        {
            results = await db.query("SELECT seatleft_business FROM SEAT_INFO WHERE route_id = $1 and journeydate = $2", [req.body.route_id, req.body.date]);
            x = results.rows[0].seatleft_business;
        }
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            seat : x
        });
    }
    catch (err){
        res.status(201).json({
            status: "failure"
        });
    }
});

app.post("/api/v1/route/distanceandcost", async (req, res ) => {
    try
    {
        let results;
        let distance = 0.0, cost = 0;
        results = await db.query("SELECT distance_km FROM route WHERE id = $1", [req.body.route_id]);
        distance = (results.rows[0].distance_km);
        if(req.body.seat_type == 'commercial') results = await db.query(`select cost_commercial as c from seat_info where route_id = $1 and journeydate = $2`, [req.body.route_id, req.body.date]);
        else results = await db.query(`select cost_business as c from seat_info where route_id = $1 and journeydate = $2`, [req.body.route_id, req.body.date]);
        cost = results.rows[0].c;
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            distance : distance,
            cost: cost
        });
    }
    catch (err){
        res.status(201).json({
            status: "failure"
        });
    }
});

// add user review
app.post("/api/v1/:user_id/review/", async (req, res) => {
    try
    {
        console.log(req.body);
        const results = await db.query("INSERT INTO Review (user_id, airplane_id, message, rating, Date) values ($1, $2, $3, $4, CURRENT_TIMESTAMP) returning *", [req.params.user_id, req.body.airplane_id, req.body.message, req.body.rating]);
        console.log(req.params.user_id);
        console.log(results.rows);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                FlightForge : results.rows,
            }
        });
    } catch (err){
        console.log("baaal");
    }
});

app.listen(port, () => {
    console.log(`Server is up, on port ${port}`);
});