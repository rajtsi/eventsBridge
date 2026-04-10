export default {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Services", [
      {
        id: "3dfe747a-c254-482c-9469-c78a4f47730c",
        name: "email-service",
        base_url: "http://localhost:3000/webhook/test1",
        secret: "secret1",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Services", null, {});
  }
};