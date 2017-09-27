const _ = require("lodash");
const express = require("express");
const config = require("./config");
const db = require("./db");
const user = require("./routes/user");
const group = require("./routes/group");
const membership = require("./routes/membership");
const request = require('request');

/*************************** Associations ********************************** */
const User = require("./models/user");
const Group = require("./models/group").Group;
const Membership = require("./models/group").Membership;

// Order is important here
//User.sync();
//Group.sync();
//Membership.sync();

/************************************************************************** */

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*************************** Authentication ******************************** */

const https = require("https");
const jwt = require("jsonwebtoken");
const passport = require("passport");
app.use(passport.initialize());

const generateUserToken = (userTokenSubject) => {

    const expiresIn = "7d";
    const issuer = config.get("authentication.token.issuer");
    const audience = config.get("authentication.token.audience");
    const secret = config.get("authentication.token.secret");

    let userToken = jwt.sign({}, secret, {
        expiresIn: expiresIn,
        audience: audience,
        issuer: issuer,
        subject: JSON.stringify(userTokenSubject)
    });

    return userToken;
};

const fbClientId = config.get("authentication.facebook.clientId");
const fbClientSecret = config.get("authentication.facebook.clientSecret");

const exchangeFbToken = (fbToken) => {
    let query = "?grant_type=fb_exchange_token&client_id=" + fbClientId + 
        "&client_secret=" + fbClientSecret + "&fb_exchange_token=" + fbToken;

    return new Promise((resolve, reject) => {
        https.get("https://graph.facebook.com/oauth/access_token" + query, (res) => {
            if (res.statusCode !== 200) {
                reject("Got status code " + res.statuscode + " while exchanging fb token, " + "https://graph.facebook.com/oauth/access_token" + query);
            } else {
                let responseData = "";
                res.on("data", (dataChunk) => {
                    responseData = responseData + dataChunk;
                });
                res.on("end", () => {
                    resolve(responseData);
                });
            }
        }).on("error", (err) => {
            reject(err);
        });
    });
};

app.get("/generateServerToken", (req, res) => {
    let fbToken = req.query.fbToken;
    let fbDisplayName = req.query.name;
    let fbId = req.query.fid;
    let fbPrimaryEmail = req.query.email;

    if (fbPrimaryEmail === "undefined") {
        fbPrimaryEmail = fbId + "@thealfredbutler.com";
    }

    exchangeFbToken(fbToken).then((fbResponseJSON) => {
        let fbResponse = JSON.parse(fbResponseJSON);
        let newFbToken = fbResponse.access_token;

        User.findOrCreate({
            where: {
                fid: fbId,
            },
            defaults: {
                name: fbDisplayName,
                email: fbPrimaryEmail,
            }
        }).then((sequelizeResponse) => {
            let user = sequelizeResponse[0].dataValues;
            let userTokenSubject = {
                user: user,
                fbToken: newFbToken,
            };

            let jwtToken = generateUserToken(userTokenSubject);
            res.json({
                token: jwtToken
            });
        });
    }).catch((err) => {
        res.json({
            err: err,
            token: null
        });
    });
});

app.post("/deauthorize/callback", (req, res) => {
    // Nothing to do
    res.json({
        status: "success"
    });
});


/************************** JWT Authentication ***************************** */

const passportJwt = require("passport-jwt");

const passportJWTOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get("authentication.token.secret"),
  issuer: config.get("authentication.token.issuer"),
  audience: config.get("authentication.token.audience")
};

passport.use(new passportJwt.Strategy(passportJWTOptions, function(jwtPayload, done) {
    let userSubjectToken = JSON.parse(jwtPayload.sub);
    return done(null, userSubjectToken);
}));


/******************************** User ************************************* */

app.get("/profile", passport.authenticate(["jwt"], { session: false }), (req, res) => {
    let userTokenSubject = req.user;
    res.json({
        user: userTokenSubject.user
    });
});

/******************************** Uber ************************************* */
var uberKey = config.get("authentication.uber.apiKey");

app.get("/uber", (req, res) => {
    let startLat = getReviewLimit(Number(req.query.lat));
    let startLng = getReviewOffset(Number(req.query.lng));

    var options = {
        url: 'https://api.uber.com/v1.2/estimates/time?start_latitude=' + startLat + '&start_longitude=' + startLng,
        headers: {
            'Authorization': 'Token ' + uberKey,
            'Content-Type': 'application/json'
        }
    };
       
    function callback(error, response, body) {
        console.log(response, body);
        if (!error && response.statusCode == 200) {
            res.json({
                res: body
            })
        } else {
            res.json({
                res: null
            })
        }
    }
       
    request(options, callback);
})


/******************************** Debug ************************************* */
app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.use('/user', user);
app.use('/group', group);
app.use('/membership', membership);

const port = config.get("http.port");
const ip = config.get("http.ip");

app.listen("3000", "127.0.0.1", () => {
    console.log("Server started on port 3000");
});