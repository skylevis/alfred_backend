const convict = require("convict");

const config = convict({
    http: {
        port: {
            doc: "The port to listen on",
            default: 3000,
            env: "PORT"
        }, 
        ip: {
            doc: "The ip to listen on", 
            default: "127.0.0.1", 
            env: "IP"
        }
    },
    authentication: {
        facebook: {
            clientId: {
                doc: "The Client ID from Facebook to use for authentication",
                default: "113701052652102",
                env: "FACEBOOK_CLIENT_ID"
            },
            clientSecret: {
                doc: "The Client Secret from Facebook to use for authentication",
                default: "a27ce105453b9a8f4656830d945753a7",
                env: "FACEBOOK_CLIENT_SECRET"
            }
        },
        token: {
            secret: {
                doc: "The signing key for the JWT",
                default: "$rE3@wQ1",
                env: "JWT_SIGNING_KEY"
            },
            issuer: {
                doc: "The issuer for the JWT",
                default: "api.thealfredbutler.com"
            },
            audience: {
                doc: "The audience for the JWT",
                default: "thealfredbutler.com"
            }
        }
    }, 
    database: {
        mysql: {
            name: {
                doc: "The name of the database",
                default: "ALFRED",
                env: "MYSQL_DATABASE"
            },
            port: {
                doc: "The port to listen to",
                default: 3306,
                env: "MYSQL_PORT"
            }, 
            host: {
                doc: "The host to listen to", 
                default: "127.0.0.1",
                env: "MYSQL_HOST"
            },
            user: {
                doc: "The user for database login",
                default: "alfred",
                env: "MYSQL_USER"
            }, 
            password: {
                doc: "The password for database login", 
                default: "Alfred343$", 
                env: "MYSQL_PASSWORD"
            }
        }
    }
});

config.validate();

module.exports = config;