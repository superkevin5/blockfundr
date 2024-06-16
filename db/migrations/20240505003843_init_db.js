/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.raw(`
        CREATE TABLE IF NOT EXISTS public.users
        (
            id serial,
            wallet_address text,
            PRIMARY KEY (id)
            );

        CREATE TABLE IF NOT EXISTS public.projects
        (
            id serial,
            title text NOT NULL,
            description text,
            goal numeric NOT NULL,
            deadline time with time zone NOT NULL,
            is_reach_goal boolean DEFAULT false,
            is_closed boolean DEFAULT false,
            fund_raiser_id integer,
            video_url text,
            created_at time with time zone,
            updated_at time with time zone,
            PRIMARY KEY (id)
            );

        CREATE TABLE IF NOT EXISTS public.investor_records
        (
            id serial,
            fund_amount numeric,
            project_id integer NOT NULL,
            investor_id integer NOT NULL,
            is_withdrawn boolean DEFAULT false,
            fund_time time with time zone NOT NULL,
            is_rewarded boolean DEFAULT false,
            withdraw_time time with time zone,
            reward_time time with time zone,
            created_at time with time zone,
            updated_at time with time zone,
            PRIMARY KEY (id)
            );

        ALTER TABLE IF EXISTS public.projects
            ADD FOREIGN KEY ("fund_raiser_id")
            REFERENCES public.users (id) MATCH SIMPLE
            ON UPDATE NO ACTION
               ON DELETE NO ACTION
    NOT VALID;


        ALTER TABLE IF EXISTS public.investor_records
            ADD FOREIGN KEY (project_id)
            REFERENCES public.projects (id) MATCH SIMPLE
            ON UPDATE NO ACTION
               ON DELETE NO ACTION
    NOT VALID;


        ALTER TABLE IF EXISTS public.investor_records
            ADD FOREIGN KEY (investor_id)
            REFERENCES public.users (id) MATCH SIMPLE
            ON UPDATE NO ACTION
               ON DELETE NO ACTION
    NOT VALID;
    `);

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {

    await knex.raw(`
        DROP TABLE IF EXISTS investor_records CASCADE;
        DROP TABLE IF EXISTS projects CASCADE;
        DROP TABLE IF EXISTS users CASCADE;

    `);
};


