export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Deliveries", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      event_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Events",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      subscription_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Subscriptions",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      status: {
        type: Sequelize.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending"
      },

      attempt_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      response: {
        type: Sequelize.JSONB,
        allowNull: true
      },

      next_retry_at: {
        type: Sequelize.DATE,
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


    await queryInterface.addIndex(
      "Deliveries",
      ["status", "next_retry_at"],
      { name: "idx_deliveries_status_retry" }
    );

    await queryInterface.addIndex("Deliveries", ["event_id"], {
      name: "idx_deliveries_event_id"
    });

    await queryInterface.addIndex("Deliveries", ["subscription_id"], {
      name: "idx_deliveries_subscription_id"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Deliveries");
  }
};