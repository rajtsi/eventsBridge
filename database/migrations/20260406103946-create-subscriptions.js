export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subscriptions", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      event_type: {
        type: Sequelize.STRING,
        allowNull: false
      },

      service_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Services",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      metadata: {
        type: Sequelize.JSONB,
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


    await queryInterface.addIndex("Subscriptions", ["event_type"], {
      name: "idx_subscriptions_event_type"
    });

    await queryInterface.addIndex("Subscriptions", ["service_id"], {
      name: "idx_subscriptions_service_id"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Subscriptions");
  }
};