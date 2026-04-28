export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WebhookClients", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      clientId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      service: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      secret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint("WebhookClients", {
      fields: ["clientId", "service"],
      type: "unique",
      name: "unique_client_service",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("WebhookClients");
  },
};