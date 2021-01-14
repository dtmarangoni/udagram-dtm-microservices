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
        return queryInterface.createTable('FeedItem', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            caption: {
                type: Sequelize.STRING,
            },
            url: {
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
        return queryInterface.dropTable('FeedItem');
    },
};
