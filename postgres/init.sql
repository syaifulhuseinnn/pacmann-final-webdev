CREATE extension IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();

CREATE type status AS ENUM ('todo','doing','done');

-- Create the User Accounts table
CREATE TABLE user_accounts (
    user_id uuid DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT null,
    PRIMARY KEY (user_id)
);

-- Create the Projects table
CREATE TABLE projects (
    project_id uuid DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_accounts(user_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id)
);

-- Create the Tasks table
CREATE TABLE tasks (
    task_id uuid DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    status status NOT NULL DEFAULT 'todo',
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user_accounts(user_id) ON DELETE CASCADE,
    PRIMARY KEY (task_id)
);

-- Insert data to user_accounts table
INSERT INTO user_accounts (user_id,email,password) VALUES ('897ae744-ce13-4211-adfc-7c07d0fc73bc','john@mail.com','12345');

-- Insert data to projects table
INSERT INTO projects (project_id,title,user_id) VALUES ('d2d6f5a2-864f-480a-a1b7-1661a0204ac3','Buy daily needs','897ae744-ce13-4211-adfc-7c07d0fc73bc');

-- Insert data to tasks table
INSERT INTO tasks (description,status,project_id,user_id)
VALUES
('Buy tomato 2kg','todo','d2d6f5a2-864f-480a-a1b7-1661a0204ac3','897ae744-ce13-4211-adfc-7c07d0fc73bc'),
('Buy union 500gr at Indomaret','todo','d2d6f5a2-864f-480a-a1b7-1661a0204ac3','897ae744-ce13-4211-adfc-7c07d0fc73bc'),
('Buy potato 1.5kg','todo','d2d6f5a2-864f-480a-a1b7-1661a0204ac3','897ae744-ce13-4211-adfc-7c07d0fc73bc');