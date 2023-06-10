const { Sequelize } = require('sequelize');


const userModel = require('./users');
const categoryModel = require('./category');
const categoryHierarchyModel = require('./categoryHierarchy');
const productModel = require('./products');


exports.db_config = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      operatorsAliases: 0,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      timezone: '+05:30',
      logging: false,
    }
  );

  exports.userModel = userModel(exports.db_config);
  exports.categoryModel = categoryModel(exports.db_config);
  exports.categoryHierarchyModel = categoryHierarchyModel(exports.db_config);
  exports.productModel = productModel(exports.db_config);