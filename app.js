// app.js

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const session = require("express-session");
require('dotenv').config();


const app = express();

app.use(
  session({
    secret: "your_secret_key", 
    resave: false,
    saveUninitialized: true,
  })
);


app.set("views", path.join(__dirname, "views"));


app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});


const Organizer = sequelize.define(
  "Organizer",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other options like tableName, timestamps, etc.
  }
);

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    
  }
);

const Participant = sequelize.define("Participant", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Registered = sequelize.define(
  "Registered",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    participant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
   
  }
);


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



app.get("/participant", async (req, res) => {
  try {
    
    if (req.session && req.session.participantId) {
      const participant = await Participant.findByPk(req.session.participantId);

      const events = await Event.findAll();

      const registeredEvents = await Registered.findAll({
        where: { participant_id: req.session.participantId },
      });

      res.render("participant", { participant, events, registeredEvents });
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
    const {
      eventName,
      eventId,
      organizerName,
      participantId,
      participantName,
    } = req.body;
    console.log({
      eventName,
      eventId,
      organizerName,
      participantId,
      participantName,
    });
    await Registered.create({
      event_name: eventName,
      event_id: eventId,
      organizer_name: organizerName,
      participant_id: participantId,
      participant_name: participantName,
    });

    res.redirect("/participant");
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).send("Error registering for event");
  }
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
  const participant = await Participant.findOne({ where: { email, password } });

  if (participant) {
    req.session.participantId = participant.id; 
    res.redirect("/participant");
  } else {
    res.render("login", { error: "Invalid email or password" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.get('/organizer', async (req, res) => {
  try {
    if (!req.session || !req.session.organizerId) {
      return res.redirect('/organizer_login');
    }

    const organizer = await Organizer.findByPk(req.session.organizerId);

    if (!organizer) {
      return res.redirect('/organizer_login');
    }

    const events = await Event.findAll();

    const registeredParticipants = await Registered.findAll();

    res.render('organizer', { organizer, events, registeredParticipants });
  } catch (error) {
    console.error('Error rendering organizer dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/organizer_login', async (req, res) => {
  try {
    const { organizerEmail, password } = req.body;
    console.log({ organizerEmail, password });
    
    const organizer = await Organizer.findOne({ where: { organizerEmail, password } });
    if (!organizer) {
      return res.redirect('/organizer_login?error=invalid');
    }

    req.session.organizerId = organizer.id;


    res.redirect('/organizer');
  } catch (error) {
    console.error('Error logging in organizer:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/organizer_login", (req, res) => {
  res.render("organizer_login");
});

app.post("/signup/organizer", async (req, res) => {
  try {
    const { eventName, organizerName, organizerEmail, password } = req.body;

    const newOrganizer = await Organizer.create({
      eventName: eventName,
      organizerName: organizerName,
      organizerEmail: organizerEmail,
      password: password, 
    });

    const newEvent = await Event.create({
      event_name: eventName,
      organizer_name: organizerName, 
    });

    res.redirect("/organizer_login");
  } catch (error) {
    console.error("Error registering organizer and event:", error);
    res.status(500).send("Error registering organizer and event");
  }
});

app.post("/signup/participant", async (req, res) => {
  try {
    await Participant.create(req.body);
    res.redirect("/login");
  } catch (err) {
    console.error("Error creating participant:", err);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
