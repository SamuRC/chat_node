-- ---
-- Table 'users'
-- 
-- ---
	
CREATE TABLE users(
  id INTEGER PRIMARY KEY,
  username CHAR(50) NULL,
  password CHAR(50) NULL DEFAULT NULL,
  status CHAR(1) NOT NULL DEFAULT 'NULL',
  last_login INTEGER,
  creation_time INTEGER  
);

-- ---
-- Table 'clients'
-- 
-- ---
		
CREATE TABLE clients (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  type INTEGER NOT NULL DEFAULT 0,
  name VARCHAR(15) NOT NULL,
  phone VARCHAR(10) NOT NULL,
  email VARCHAR(50) NOT NULL
);

-- ---
-- Table 'rooms'
-- 
-- ---
		
CREATE TABLE rooms (
  id INTEGER PRIMARY KEY,
  status CHAR(2) NOT NULL DEFAULT '0'
);

-- ---
-- Table 'messages'
-- 
-- ---
	
CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  room_id INTEGER REFERENCES rooms,
  user_id INTEGER REFERENCES users,
  text TEXT NOT NULL,
  creation_time INTEGER
);


-- ---
-- Table 'operators'
-- 
-- ---
		
CREATE TABLE operators (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  name CHAR(50) NOT NULL
);

-- ---
-- Table 'users_rooms'
-- 
-- ---
	
CREATE TABLE users_rooms (
  id INTEGER PRIMARY KEY,
  room_id INTEGER REFERENCES rooms,
  user_id INTEGER REFERENCES users
);
