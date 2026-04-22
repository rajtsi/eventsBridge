export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Subscriptions", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Subscriptions", "is_active");
  }
};