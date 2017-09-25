const db = require("../db");
const User = require("./user");

const Group = db.sequelize.define('group', {
    groupId: { type: db.Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name: { type: db.Sequelize.STRING, allowNull:  false, unique: true },
    password: { type: db.Sequelize.STRING, allowNull:  false},
    ownerId: { type: db.Sequelize.INTEGER, allowNull: false}
});

const Membership = db.sequelize.define('Membership', {});

Group.belongsToMany(User, {as: 'Members', through: 'Membership'});
User.belongsToMany(Group, {as: 'Groupings', through: 'Membership'});

module.exports.Group = Group;
module.exports.Membership = Membership;
