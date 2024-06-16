exports.seed = async function(knex) {
    await knex('investor_records').del();
    await knex('projects').del();
    await knex('users').del();
  };
