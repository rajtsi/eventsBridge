export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("IdempotencyKeys", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      response: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("IdempotencyKeys");
  },
};