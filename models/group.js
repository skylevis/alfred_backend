const db = require("../db");
const User = require("./user");

const Group = db.sequelize.define('group', {
    group_id: { type: db.Sequelize.INTEGER,  primaryKey: true  },
    name: { type: db.Sequelize.STRING, allowNull:  false },
    password: { type: db.Sequelize.STRING, allowNull:  false}
});

const Membership = db.sequelize.define('Membership', {});

Group.belongsToMany(User, {through: 'Membership'});
User.belongsToMany(Group, {through: 'Membership'});

module.exports.Group = Group;
module.exports.Membership = Membership;
