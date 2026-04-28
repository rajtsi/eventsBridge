export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Subscriptions', {
      fields: ['service_id', 'event_type'],
      type: 'unique',
      name: 'unique_service_event_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Subscriptions',
      'unique_service_event_constraint'
    );
  }
};