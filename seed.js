const config = require("./config");
const db = require("./db");

/*************************** Associations ********************************** */
const User = require("./models/user");
const Group = require("./models/group").Group;
const Membership = require("./models/group").Membership;

/******************************* Seed ************************************** */

const userSeed = require("./seed/user_seed");
const groupSeed = require("./seed/group_seed");
const membershipSeed = require("./seed/membership_seed");

// Order is important here
db.sequelize.dropAllSchemas().then(() => {
    return Promise.all([
        User.sync(),
    ]);
}).then(() => {
    return Group.sync();
}).then(() => {
    return Membership.sync();
}).then(() => {
    return Promise.all(userSeed.map((user) => {
        return User.create(user);
    }));
}).then(() => {
    return Promise.all(groupSeed.map((group) => {
        return Group.create(group);
    }));
}).then(() => {
    return Promise.all(membershipSeed.map((membership) => {
        return Membership.create(membership);
    }));
}).then(() => {
    console.log("Seeding complete");
    process.exit(0);
}).catch((err) => {
    console.error(err);
});

