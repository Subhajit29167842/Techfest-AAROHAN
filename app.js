// app.js

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Define the OrganizingTeam model
const OrganizingTeam = sequelize.define(
  "organizingteam",
  {
    team_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_head_roll_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_head_fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_head_lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // tableName: 'organizingteams',
  }
);

const Volunteer = sequelize.define(
  "volunteer",
  {
    roll_number: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // tableName: 'volunteers',
  }
);

// Define foreign key constraint
Volunteer.belongsTo(OrganizingTeam, {
  foreignKey: "team_name",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Define the events model
const Event = sequelize.define("event", {
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  event_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  event_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});
// Define the workshops model
const Workshop = sequelize.define("workshop", {
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  max_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  registration_deadline: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  team_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Define foreign key constraint
Workshop.belongsTo(Event, {
  foreignKey: "event_name",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Define the seminar model
const Seminar = sequelize.define("seminar", {
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  target_audience: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define foreign key constraint
Seminar.belongsTo(Event, {
  foreignKey: "event_name",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Define the ORGANIZES model
const Organize = sequelize.define("organize", {
  team_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
});

// Define foreign key constraints
Organize.belongsTo(OrganizingTeam, {
  foreignKey: "team_name",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Organize.belongsTo(Event, {
  foreignKey: "event_name",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Define the PARTICIPANTS model
const Participant = sequelize.define("participant", {
  participant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  fname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  college_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roll_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("M", "F", "O"),
    allowNull: false,
  },
  participant_type: {
    type: DataTypes.ENUM("InHouse", "Outside"),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// Define the InHouseParticipants model
const InHouseParticipant = sequelize.define("inHouseParticipant", {
  participant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  hall_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Define foreign key constraint
InHouseParticipant.belongsTo(Participant, {
  foreignKey: "participant_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Define the OutsideParticipants model
const OutsideParticipant = sequelize.define("outsideParticipant", {
  participant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accommodation: {
    type: DataTypes.ENUM("Y", "N"),
    allowNull: false,
  },
});

// Define foreign key constraint
OutsideParticipant.belongsTo(Participant, {
  foreignKey: "participant_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Define the PARTICIPATES model
const Participate = sequelize.define("participate", {
  participant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
});

// Define foreign key constraints
Participate.belongsTo(Participant, {
  foreignKey: "participant_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Participate.belongsTo(Event, {
  foreignKey: "event_name",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Define the Speaker model
const Speaker = sequelize.define("speaker", {
  event_name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  speaker_name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
});

// Define foreign key constraint
Speaker.belongsTo(Event, {
  foreignKey: "event_name",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Define the Sponsoring model
const Sponsoring = sequelize.define("sponsoring", {
  sponsor_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Sponsoring.belongsTo(Event, { foreignKey: 'event_name', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

sequelize
  .sync()
  .then(() => console.log("Database synchronized"))
  .catch((err) => console.error("Error synchronizing database:", err));

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Error logging out");
    } else {
      res.redirect("/");
    }
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const participant = await Participant.findOne({
    where: { email: email, password: password },
  });
  console.log(participant);
  if (participant) {
    req.session.participant_id = participant.participant_id;
    res.redirect("/participant");
  } else {
    res.render("login", { error: "Invalid email or password" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/organizer_login", async (req, res) => {
  try {
    const { teamName, email, password } = req.body;
    console.log({ teamName, email, password });

    const team = await OrganizingTeam.findOne({
      where: { team_name: teamName, email: email, password: password },
    });
    if (!team) {
      return res.redirect("/organizer_login?error=invalid");
    }

    req.session.team_name = teamName;

    res.redirect("/organizer");
  } catch (error) {
    console.error("Error logging in organizer:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/organizer_login", (req, res) => {
  res.render("organizer_login");
});

app.post("/signup/organizer", async (req, res) => {
  try {
    const {
      teamName,
      email,
      headFname,
      headLname,
      headRollNumber,
      headPhoneNumber,
      password,
    } = req.body;

    // Check if the team name already exists
    const existingTeam = await OrganizingTeam.findOne({
      where: { team_name: teamName },
    });
    if (existingTeam) {
      return res.status(400).send("Team name already exists");
    }

    // Create a new team
    const newTeam = await OrganizingTeam.create({
      team_name: teamName,
      email: email,
      team_head_roll_no: headRollNumber,
      team_head_fname: headFname,
      team_head_lname: headLname,
      password: password,
    });

    // Create the volunteer entry for the team head
    await Volunteer.create({
      roll_number: headRollNumber,
      fname: headFname,
      lname: headLname,
      team_name: teamName,
      phone_number: headPhoneNumber,
    });

    req.session.team_name = newTeam.team_name;
    // Redirect to the page for adding volunteers with teamId passed as query parameter
    res.redirect(`/add_volunteers`);
  } catch (error) {
    console.error("Error signing up organizer:", error);
    res.status(500).send("Error signing up organizer");
  }
});

// POST route for adding volunteers
app.post("/add_volunteers", async (req, res) => {
  try {
    const team_name = req.session.team_name;
    const { rollNumber, fname, lname, phoneNumber } = req.body;

    console.log({ rollNumber, fname, lname, phoneNumber, team_name });

    // Create the volunteer entry
    await Volunteer.create({
      roll_number: rollNumber,
      fname: fname,
      lname: lname,
      team_name: team_name,
      phone_number: phoneNumber,
    });

    res.redirect(`/add_volunteers`);
  } catch (error) {
    console.error("Error adding volunteer:", error);
    res.status(500).send("Error adding volunteer");
  }
});

app.get("/add_volunteers", (req, res) => {
  res.render("add_volunteers");
});
app.get("/organizer", async (req, res) => {
  try {
    if (!req.session || !req.session.team_name) {
      return res.redirect("/organizer_login");
    }

    const team = await OrganizingTeam.findByPk(req.session.team_name);

    if (!team) {
      return res.redirect("/organizer_login");
    }

    const events = await sequelize.query(
      `SELECT 
      sub.team_name,
      e.event_name,
      e.event_date,
      e.event_time,
      e.location,
      e.event_type,
      e.budget
  FROM 
      (
          SELECT 
              ot.team_name,
              o.event_name 
          FROM 
              organizes o 
          JOIN 
              organizingteams ot ON o.team_name = ot.team_name and o.team_name='${team.team_name}'
      ) AS sub 
  JOIN 
      events e ON sub.event_name = e.event_name;
  `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const participants = await sequelize.query(
      `SELECT 
      sub.team_name,
      sub.event_name,
      sub.participant_id,
      p.fname,
      p.lname,
      p.email,
      p.college_name,
      p.roll_number,
      p.gender,
      p.participant_type 
  FROM (
      SELECT 
          o.team_name,
          o.event_name,
          ps.participant_id 
      FROM 
          organizes o 
      JOIN 
          participates ps ON o.event_name = ps.event_name and o.team_name='${team.team_name}'
  ) AS sub 
  JOIN 
      participants p ON sub.participant_id = p.participant_id;
  `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const volunteers = await sequelize.query(
      `select roll_number,fname, lname, phone_number from volunteers where team_name='${team.team_name}';`,
      { type: Sequelize.QueryTypes.SELECT }
    );


    const seminars = await sequelize.query(
      `SELECT  event_name, topic, target_audience from seminars where event_name in(SELECT 
        sub.event_name
    FROM 
        (
            SELECT 
                ot.team_name,
                o.event_name 
            FROM 
                organizes o 
            JOIN 
                organizingteams ot ON o.team_name = ot.team_name and o.team_name='${team.team_name}'
        ) AS sub 
    JOIN 
        events e ON sub.event_name = e.event_name);`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const workshops = await sequelize.query(
      `SELECT  event_name, theme, max_capacity,registration_deadline, team_size  from workshops where event_name in(SELECT 
        sub.event_name
    FROM 
        (
            SELECT 
                ot.team_name,
                o.event_name 
            FROM 
                organizes o 
            JOIN 
                organizingteams ot ON o.team_name = ot.team_name and o.team_name='${team.team_name}'
        ) AS sub 
    JOIN 
        events e ON sub.event_name = e.event_name);`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const speakers = await sequelize.query(
      `SELECT  speaker_name, event_name  from speakers where event_name in(SELECT 
        sub.event_name
    FROM 
        (
            SELECT 
                ot.team_name,
                o.event_name 
            FROM 
                organizes o 
            JOIN 
                organizingteams ot ON o.team_name = ot.team_name and o.team_name='${team.team_name}'
        ) AS sub 
    JOIN 
        events e ON sub.event_name = e.event_name);`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const sponsors = await sequelize.query(
      `SELECT  sponsor_name, event_name  from sponsorings where event_name in(SELECT 
        sub.event_name
    FROM 
        (
            SELECT 
                ot.team_name,
                o.event_name 
            FROM 
                organizes o 
            JOIN 
                organizingteams ot ON o.team_name = ot.team_name and o.team_name='${team.team_name}'
        ) AS sub 
    JOIN 
        events e ON sub.event_name = e.event_name);`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const inHouse = await sequelize.query(
      `SELECT  participant_id, hall_no  from inHouseParticipants where participant_id in(SELECT 
        
        sub.participant_id
    FROM (
        SELECT 
            o.team_name,
            o.event_name,
            ps.participant_id 
        FROM 
            organizes o 
        JOIN 
            participates ps ON o.event_name = ps.event_name and o.team_name='${team.team_name}'
    ) AS sub 
    JOIN 
        participants p ON sub.participant_id = p.participant_id);`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const outside = await sequelize.query(
      `SELECT  participant_id, city, state, accommodation  from outsideParticipants where participant_id in(SELECT 
        
        sub.participant_id
    FROM (
        SELECT 
            o.team_name,
            o.event_name,
            ps.participant_id 
        FROM 
            organizes o 
        JOIN 
            participates ps ON o.event_name = ps.event_name and o.team_name='${team.team_name}'
    ) AS sub 
    JOIN 
        participants p ON sub.participant_id = p.participant_id);`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    res.render("organizer", {
      team,
      events,
      participants,
      volunteers,
      seminars,
      workshops,
      speakers,
      sponsors,
      inHouse,
      outside
    });
  } catch (error) {
    console.error("Error rendering organizer dashboard:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/create-event", async (req, res) => {
  try {
    const team_name = req.session.team_name;
    const {
      event_name,
      event_date,
      event_time,
      location,
      budget,
      event_type,
      sponsor_name,
      sponsor_amount,
    } = req.body;
    console.log({
      event_name,
      event_date,
      event_time,
      location,
      event_type,
      sponsor_name,
      sponsor_amount,
    });

    const event = await Event.create({
      event_name,
      event_date,
      event_time,
      location,
      budget,
      event_type,
    });

    if (event_type === "Workshop") {
      const { theme, max_capacity, registration_deadline, team_size } =
        req.body;
      await Workshop.create({
        event_name,
        theme,
        max_capacity,
        registration_deadline,
        team_size,
      });
    } else if (event_type === "Seminar") {
      const { topic, target_audience, speaker_name } = req.body;
      console.log({ topic, target_audience, speaker_name });

      await Seminar.create({
        event_name: event_name,
        topic: topic,
        target_audience: target_audience,
      });

      for (let i = 0; i < speaker_name.length; i++) {
        const name = sponsor_name[i];

        console.log(`Even Name :${event_name} Speker Name: ${name}`);
        if (name) {
          await Speaker.create({ event_name: event_name, speaker_name: name });
        }
      }
    }

    await Organize.create({
      team_name,
      event_name,
    });

    for (let i = 0; i < sponsor_name.length; i++) {
      const name = sponsor_name[i];
      const amount = sponsor_amount[i];
      console.log(`Sponsor Name: ${name}, Amount: ${amount}`);
      if (name && amount) {
        await Sponsoring.create({
          sponsor_name: name,
          event_name: event_name,
          amount: amount,
        });
      }
    }

    res.redirect("/organizer");
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Error creating event");
  }
});

app.get("/create_event", (req, res) => {
  res.render("create_event");
});

app.post("/signup/participant", async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      college_name,
      rollNumber,
      gender,
      participantType,
      password,
    } = req.body;

    console.log(req.body);

    const existingParticipant = await Participant.findOne({
      where: { college_name: college_name, roll_number: rollNumber },
    });
    if (existingParticipant) {
      return res.status(400).send("Participant already exists");
    }
    const participant = await Participant.create({
      fname: fname,
      lname: lname,
      email: email,
      college_name: college_name,
      roll_number: rollNumber,
      gender: gender,
      participant_type: participantType,
      password: password,
    });
    console.log(participant);

    if (participantType === "inHouse") {
      const { hallNo } = req.body;
      await InHouseParticipant.create({
        participant_id: participant.participant_id,
        hall_no: hallNo,
      });
    } else {
      const { city, state } = req.body;
      let accommodation = "Y";
      if (city === "Durgapur") accomodation = "N";
      await OutsideParticipant.create({
        participant_id: participant.participant_id,
        city,
        state,
        accommodation,
      });
    }

    req.session.participant_id = participant.participant_id;
    res.redirect("/participant");
  } catch (error) {
    console.error("Error signing up participant:", error);
    res.status(500).send("Error signing up participant");
  }
});
app.get("/participant", async (req, res) => {
  try {
    if (req.session && req.session.participant_id) {
      const participant = await Participant.findByPk(
        req.session.participant_id
      );
      // console.log(participant);

      const registeredEvents = await sequelize.query(
        `SELECT 
        ot.team_name,
        ot.email,
        e.event_name,
        e.event_date,
        e.event_time,
        e.location,
        e.event_type
        
    FROM 
        organizingteams ot
    JOIN 
        organizes o ON ot.team_name = o.team_name
    JOIN 
        (SELECT * FROM events WHERE event_name IN (SELECT event_name FROM participates WHERE participant_id = ${participant.participant_id})) AS e 
        ON o.event_name = e.event_name;
    `,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const events = await sequelize.query(
        `SELECT 
        subquery.team_name,
        subquery.email,
        subquery.event_name,
        subquery.event_date,
        subquery.event_time,
        subquery.location,
        subquery.event_type
        
      FROM 
        (
          SELECT 
            ot.team_name,
            ot.email,
            e.event_name,
            e.event_date,
            e.event_time,
            e.location,
            e.event_type
            
          FROM 
            organizingteams ot
          JOIN 
            organizes o ON ot.team_name = o.team_name
          JOIN 
            events e ON o.event_name = e.event_name
        ) AS subquery 
      WHERE 
        subquery.event_name NOT IN (
          SELECT DISTINCT event_name 
          FROM participates 
          WHERE participant_id = ${participant.participant_id}
        );`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const seminars = await sequelize.query(
        `SELECT  event_name, topic, target_audience from seminars;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const workshops = await sequelize.query(
        `SELECT  event_name, theme, max_capacity,registration_deadline, team_size  from workshops;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const speakers = await sequelize.query(
        `SELECT  speaker_name, event_name  from speakers;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const sponsors = await sequelize.query(
        `SELECT  sponsor_name, event_name  from sponsorings;`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      res.render("participant", {
        participant,
        events,
        registeredEvents,
        seminars,
        workshops,
        speakers,
        sponsors,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error fetching data for participant dashboard:", error);
    res.status(500).send("Error fetching data for participant dashboard");
  }
});

app.post("/register-event", async (req, res) => {
  try {
    const { event_name, participant_id } = req.body;

    sequelize.query(
      `INSERT INTO participates  VALUES (${participant_id}, '${event_name}', now(), now());`
    );

    res.redirect("/participant");
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).send("Error registering for event");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
