require("dotenv").config();
const cors = require('cors');
const morgan = require("morgan");
const express = require("express");
const port = process.env.PORT;
const db = require("./db");
const crypto = require('crypto');


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



            // ######### USER ######### //
            // ######### USER ######### //
            // ######### USER ######### //
//signup
app.post("/api/v1/user/signup", async (req, res) => {
    try {
        console.log(req.body);
        const { first_name, last_name, dateofbirth, mobileno, password, city, country, zipcode } = req.body;

        // Assuming you have the sha256 function available for hashing the password
        const hashedPassword = sha256(password);

        const results = await db.query(
            `INSERT INTO APP_USER (first_name, last_name, dateofbirth, mobileno, password, city, country, zipcode, age)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CalculateAge($3))
            RETURNING *`,
            [first_name, last_name, dateofbirth, mobileno, hashedPassword, city, country, zipcode]
        );

        console.log(results.rows);

        if (results.rows.length != 0) {
            res.status(200).json({
                status: "success",
                results: results.rows.length,
                data: {
                    flightforge: results.rows,
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
        res.status(500).json({ error: "Internal server error" });
    }
});

//login
app.post("/api/v1/user/login", async (req, res) => {
    try
    {
        console.log(req.body);
        const results = await db.query("select password from APP_USER where id = $1", [req.body.user_id]);
        console.log(results.rows);
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
            res.status(200).json({
                status: "success",
                data: {
                    flightforge : results.rows,
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
app.post("/api/v1/user/login", async (req, res) => {
    try
    {
        console.log(req.body);
        const results = await db.query("select password from APP_USER where id = $1 returning *", [req.body.user_id]);
        console.log(results.rows);
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
            res.status(200).json({
                status: "success",
                data: {
                    flightforge : results.rows,
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

app.get("/api/v1/airports", async (req, res) => {
    try
    {
        const results = await db.query(
        "SELECT * FROM "+
        " AIRPORT"
        );
        console.log(results.rows);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                Airport : results.rows,
            }
        });
    } catch (err){
        //console.log(err);
    }
});

//get all restaurants
app.post("/api/v1/searchRoute", async (req, res) => {
    try
    {
        console.log(req);
        console.log(req.body);
        console.log(req.body.start_airport_name);
        const s_id = await db.query("select id from Airport where name = $1", [req.body.start_airport_name]);
        console.log(s_id.rows);
        const e_id = await db.query("select id from Airport where name = $1", [req.body.end_airport_name]);
        console.log(e_id.rows);
        const results = await db.query("select * from Route where start_airport_id = $1 and end_airport_id = $2", [s_id.rows[0].id, e_id.rows[0].id]);
        res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: {
            Route : results.rows,
        }
    });
    } catch (err){
        //console.log(err);
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