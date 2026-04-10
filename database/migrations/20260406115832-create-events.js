export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Events", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      type: {
        type: Sequelize.STRING,
        allowNull: false
      },

      payload: {
        type: Sequelize.JSONB,
        allowNull: false
      },

      source: {
        type: Sequelize.STRING,
        allowNull: true
      },

      trace_id: {
        type: Sequelize.STRING,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });


    await queryInterface.addIndex("Events", ["trace_id"], {
      name: "idx_events_trace_id"
    });

    await queryInterface.addIndex("Events", ["type"], {
      name: "idx_events_type"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Events");
  }
};