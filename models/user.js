const db = require("../db");

const User = db.sequelize.define('user', {
    //The important part
    user_id:  {
        type: db.Sequelize.STRING,
       // primaryKey: true,
        allowNull: true
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull:  false
    },
    
    //The no  so  important part
    contact_number: {
        type: db.Sequelize.INTEGER,
        allowNull:  true,
        validate: { min:  0,  max:  99999999999}
    },
    address:  {
        type: db.Sequelize.STRING,
        allowNull:  true
    },
    latitude: {
        type: db.Sequelize.FLOAT,
        allowNull:  true,
        defaultValue: null,
        validate: { min:  -90,  max:  90  }
    },
    longitude:  {
        type: db.Sequelize.FLOAT,
        allowNull:  true,
        defaultValue: null,
        validate: { min:  -180, max:  180 }
    },
});

module.exports = User;