CREATE TABLE IF NOT EXISTS public.user_notification (
  id SERIAL PRIMARY KEY NOT NULL,
  auth_id integer NOT NULL,
  icon varchar NULL DEFAULT NULL,
  url varchar NULL DEFAULT NULL,
  image varchar NULL DEFAULT NULL,
  title varchar NULL DEFAULT NULL,
  content jsonb null DEFAULT NULL,
  data jsonb null DEFAULT NULL,
  meta jsonb null DEFAULT NULL,
  compiled_at timestamp with time zone NOT NULL,
  received_at timestamp with time zone NOT NULL,
  last_received_at timestamp with time zone NULL DEFAULT NULL,
  read_at timestamp with time zone NULL DEFAULT NULL,
  type smallint null default null,
  status smallint not null default 0,
  key bytea NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL
)


alter TABLE 