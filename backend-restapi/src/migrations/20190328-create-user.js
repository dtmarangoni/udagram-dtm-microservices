// Used by sequelize to create the DB tables in case they doesn't
// exists or aren't in the same version.
// Note that the file name begins with a date. Sequelize will use this
// to create the DB tables versions stages.
// This file has the create step forward and backward in case a
// fallback in time is needed.

'use strict';
module.exports = {
    // Step forward.
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('User', {
            id: {
                allowNull: false,
                autoIncrement: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            password_hash: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    // Step backward
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('User');
    },
};
