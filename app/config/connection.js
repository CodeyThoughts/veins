//--------------------MONGO-----------------------//
exports.mongoConfig = () => {
    const mongoose = require('mongoose');
    const credentials = require('./creds/mongo');
    let dev_db_url = credentials.connectionString;

    let mongoDB = process.env.MONGODB_URI || dev_db_url;
    mongoose.connect(mongoDB, {
        useNewUrlParser: true
    });
    mongoose.Promise = global.Promise;
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

//--------------------FBASE-----------------------//
exports.fbaseConfig = () => {
        const admin = require('firebase-admin');
        const credentials = require('./creds/firebase');
        // Fetch the service account key JSON file contents

        // Initialize the app with a service account, granting admin privileges
        admin.initializeApp({
            credential: admin.credential.cert(credentials),
            databaseURL: "https://"+credentials.project_id+".firebaseio.com"
        });

        // As an admin, the app has access to read and write all data, regardless of Security Rules
        var db = admin.firestore();
        const settings = {/* your settings... */ timestampsInSnapshots: true};
        db.settings(settings);
        return db;
    }


//--------------------MSSQL-----------------------//
exports.mssqlConfig = {

    doConnect : callback => {
        var Connection = require('tedious').Connection;  
        const credentials = require('./creds/mssql');
        let connection = new Connection( credentials.sql);

        connection.on('connect', function(err) {  
            if (err) {
                console.log('Error ',err);
            }
            callback (null, connection);
        });  
    },

    doRelease : connection => {
        connection.close(err => {
            if (err) {
                console.error(err.message);
            }
        });
    }
}


//----------------------Oracle-------------------//

exports.oracleConfig = {
    doConnect : callBack => {
        var db = require('oracledb');
        var dbConfig = require('../creds/oracle.js');
    
        var config = {
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString
        };
        db.getConnection(config, callBack);
    },
    doRelease : connection => {
        connection.close(err => {
            if (err) {
                console.error(err.message);
            }
        });
    }
}

/////////////////////// mysql //////////////////////////

mysqlConfig = () => {
    const Sequelize = require('sequelize')

    const sequelize = new Sequelize('sql9265725', 'sql9265725', 'nK4PKGKww8', {
        host: 'sql9.freemysqlhosting.net',
        port: '3306',
        dialect: 'mysql',
        ssl: false,
        operatorsAliases: false,
      
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        operatorsAliases: false
      });
    
    const mysqlModels = {
        Product: sequelize.import('../models/mysql.model')
    };
    
    Object.keys(mysqlModels).forEach(key => {
      if ('associate' in mysqlModels[key]) {
        mysqlModels[key].associate(mysqlModels);
      }
    });
    
    mysqlModels.sequelize = sequelize;
    mysqlModels.Sequelize = Sequelize;
    
    
    
    return mysqlModels;
  
}

module.exports.mysqlModels = mysqlConfig();

//////////////////////////////////postgre/////////////////////////////////////


postgreConfig = () => {
    const Sequelize = require('sequelize')

    const sequelize = new Sequelize('d8cr278ff2ghto', 'enqlxxoaypmdsr', '5e698b5595246c0e146f7a1c595294014cb86a7565b25a5149428bdd0132f2fd', {
        host: 'ec2-54-75-242-222.eu-west-1.compute.amazonaws.com',
        dialect: 'postgres',
        ssl: true,
        dialectOptions : {
          ssl: true
        },
        operatorsAliases: false,
      
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        operatorsAliases: false
      });
    
    const postgreModels = {
        Product: sequelize.import('../models/postgre.model')
    };
    
    Object.keys(postgreModels).forEach(key => {
      if ('associate' in postgreModels[key]) {
        postgreModels[key].associate(postgreModels);
      }
    });
    
    postgreModels.sequelize = sequelize;
    postgreModels.Sequelize = Sequelize;
    
    return postgreModels;
}

module.exports.postgreModels = postgreConfig();
