--DATABASE--
CREATE TABLE
	users (
		user_id SERIAL PRIMARY KEY,
		username VARCHAR(255) UNIQUE NOT NULL, --formerly description
		password VARCHAR(255) NOT NULL DEFAULT '',
		email VARCHAR(255) UNIQUE,
		phone_number VARCHAR(15),
		--role VARCHAR(50),
		tickers VARCHAR(255)
	);


CREATE TYPE message_type_enum AS ENUM ('EMAIL', 'SMS');

CREATE TABLE
	settings (
		id SERIAL PRIMARY KEY,
		message_type message_type_enum NOT NULL DEFAULT 'EMAIL'
	);

INSERT INTO
	settings (id, message_type)
VALUES
	(1, 'EMAIL');





-- to connect to heroku database:
-- - download heroku cli
-- - login with heroku login
-- - go to database with "heroku pg:psql -a glacial-garden-67375"
-- - execute any sql query