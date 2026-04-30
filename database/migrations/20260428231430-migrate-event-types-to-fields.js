'use strict';

export default {
  async up(queryInterface, Sequelize) {

    // 1. add new column
    await queryInterface.addColumn("EventTypes", "fields", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // 2. fetch existing data
    const rows = await queryInterface.sequelize.query(
      `SELECT id, "requiredFields", "optionalFields" FROM "EventTypes";`
    );

    const data = rows[0];

    // 3. transform data
    for (const row of data) {
      const fields = {};

      // required
      (row.requiredFields || []).forEach((f) => {
        fields[f] = { type: "string", required: true };
      });

      // optional
      (row.optionalFields || []).forEach((f) => {
        fields[f] = { type: "string", required: false };
      });

      await queryInterface.sequelize.query(
        `UPDATE "EventTypes"
         SET "fields" = :fields
         WHERE id = :id`,
        {
          replacements: {
            id: row.id,
            fields: JSON.stringify(fields),
          },
        }
      );
    }

    // 4. remove old columns
    await queryInterface.removeColumn("EventTypes", "requiredFields");
    await queryInterface.removeColumn("EventTypes", "optionalFields");
  },

  async down(queryInterface, Sequelize) {

    // rollback: recreate old columns
    await queryInterface.addColumn("EventTypes", "requiredFields", {
      type: Sequelize.JSON,
    });

    await queryInterface.addColumn("EventTypes", "optionalFields", {
      type: Sequelize.JSON,
    });

    const rows = await queryInterface.sequelize.query(
      `SELECT id, fields FROM "EventTypes";`
    );

    const data = rows[0];

    for (const row of data) {
      const required = [];
      const optional = [];

      for (const key in row.fields) {
        if (row.fields[key].required) required.push(key);
        else optional.push(key);
      }

      await queryInterface.sequelize.query(
        `UPDATE "EventTypes"
         SET "requiredFields" = :required,
             "optionalFields" = :optional
         WHERE id = :id`,
        {
          replacements: {
            id: row.id,
            required: JSON.stringify(required),
            optional: JSON.stringify(optional),
          },
        }
      );
    }

    await queryInterface.removeColumn("EventTypes", "fields");
  },
};