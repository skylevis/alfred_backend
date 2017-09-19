const db = require("../db");

const User = db.sequelize.define('user', {
    //The important part
    userId:  {
        type: db.Sequelize.STRING,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: db.Sequelize.STRING(255),
        allowNull: false,
        unique: true,
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull:  false,
    },
    
    //The not so important part
    fid: {
        type:db.Sequelize.STRING(255),
        unique: true,
    },
    contact_number: {
        type: db.Sequelize.STRING(20),
        allowNull:  true,
    },
    address:  {
        type: db.Sequelize.STRING,
        allowNull:  true,
    },
    latitude: {
        type: db.Sequelize.FLOAT,
        allowNull:  true,
        defaultValue: null,
        validate: { min:  -90,  max:  90  },
    },
    longitude:  {
        type: db.Sequelize.FLOAT,
        allowNull:  true,
        defaultValue: null,
        validate: { min:  -180, max:  180 },
    },
});

module.exports = User;