/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.raw(`

       
        CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
            BEGIN
        IF TG_OP = 'INSERT' THEN
            NEW.created_at = CURRENT_TIMESTAMP;
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
            ELSIF TG_OP = 'UPDATE' THEN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
            END IF;
            END;
    $$ LANGUAGE plpgsql;


        CREATE TABLE IF NOT EXISTS public.users
        (
            id serial,
            wallet_address text UNIQUE,
            PRIMARY KEY (id)
            );

        CREATE TABLE IF NOT EXISTS public.projects
        (
            id serial,
            title text NOT NULL,
            description text,
            goal numeric NOT NULL,
            deadline timestamp with time zone NOT NULL,
            is_reach_goal boolean DEFAULT false,
            is_closed boolean DEFAULT false,
            fund_raiser_id integer UNIQUE,
            video_url text,
            created_at timestamp with time zone,
            updated_at timestamp with time zone,
            PRIMARY KEY (id)
            );

        CREATE TABLE IF NOT EXISTS public.investor_records
        (
            id serial,
            fund_amount numeric,
            project_id integer NOT NULL,
            investor_id integer NOT NULL,
            is_withdrawn boolean DEFAULT false,
            fund_time timestamp with time zone NOT NULL,
            is_rewarded boolean DEFAULT false,
            withdraw_time timestamp with time zone,
            reward_time timestamp with time zone,
            created_at timestamp with time zone,
            updated_at timestamp with time zone,
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
    
     CREATE TRIGGER trigger_name
        BEFORE INSERT OR UPDATE ON investor_records
        FOR EACH ROW EXECUTE FUNCTION update_timestamp();


CREATE TRIGGER trigger_name
        BEFORE INSERT OR UPDATE ON projects
        FOR EACH ROW EXECUTE FUNCTION update_timestamp();



    `);

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {

    await knex.raw(`
        DROP TABLE investor_records CASCADE;
        DROP TABLE projects CASCADE;
        DROP TABLE users CASCADE;
        DROP FUNCTION update_timestamp();

    `);
};


