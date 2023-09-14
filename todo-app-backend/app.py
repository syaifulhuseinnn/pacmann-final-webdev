from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import DataError, IntegrityError
import uuid
import bcrypt
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Configure the database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:qwerty@database:5432/todo-app'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create a SQLAlchemy instance
db = SQLAlchemy(app)

# Define the User, Project, and Task models


class User(db.Model):
    __tablename__ = 'user_accounts'
    user_id = db.Column(UUID(as_uuid=True), primary_key=True,
                        server_default=text("uuid_generate_v4()"))
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    projects = db.relationship('Project', backref='user', lazy=True)


class Project(db.Model):
    __tablename__ = 'projects'
    project_id = db.Column(UUID(as_uuid=True), primary_key=True,
                           server_default=text("uuid_generate_v4()"))
    title = db.Column(db.String(255), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        'user_accounts.user_id', ondelete='CASCADE'), nullable=False)
    tasks = db.relationship('Task', backref='project', lazy=True)


class Task(db.Model):
    __tablename__ = 'tasks'
    task_id = db.Column(UUID(as_uuid=True), primary_key=True,
                        server_default=text("uuid_generate_v4()"))
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum('todo', 'doing', 'done'),
                       default='todo', nullable=False)
    project_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        'projects.project_id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        'user_accounts.user_id', ondelete='CASCADE'), nullable=False)

# Endpoint to create a new user (POST)


@app.route('/signup', methods=['POST'])
def create_user():
    try:
        data = request.json

        if not data:
            return jsonify({'message': 'Invalid request body'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        # Hash the password before storing it in the database
        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt())

        # Create a new user with a random UUID
        user_id = str(uuid.uuid4())
        new_user = User(user_id=user_id, email=email,
                        password=hashed_password.decode('utf-8'))
        db.session.add(new_user)
        db.session.commit()

        response_data = {
            'user_id': user_id,
            'email': email
        }

        return jsonify(response_data), 201  # Return 201 Created

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400
    except IntegrityError as e:
        return jsonify({'message': 'Integrity constraint violation'}), 400

# Endpoint to retrieve user information based on email and password (GET)


@app.route('/users', methods=['POST'])
def get_user_info():
    try:
        data = request.json

        if not data:
            return jsonify({'message': 'Invalid request body'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        # Find the user by email
        user = User.query.filter_by(email=email).first()

        if user is None:
            return jsonify({'message': 'User not found'}), 404

        # Check if the provided password matches the stored hashed password
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'email': user.email, 'user_id': user.user_id})

        return jsonify({'message': 'Invalid credentials'}), 401

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400

# Endpoint to retrieve projects based on user_id and optional project_id


@app.route('/projects/<user_id>', methods=['GET'])
def get_projects(user_id):
    try:
        project_id = request.args.get('project_id')

        user = User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        if project_id:
            # If project_id is provided, retrieve a specific project and its tasks
            project = Project.query.filter_by(
                user_id=user_id, project_id=project_id).first()
            if project is None:
                return jsonify({'message': 'Project not found'}), 404

            project_data = {
                'project_id': project.project_id,
                'title': project.title,
                'tasks': []
            }

            for task in project.tasks:
                task_data = {
                    'task_id': task.task_id,
                    'description': task.description,
                    'status': task.status
                }
                project_data['tasks'].append(task_data)

            user_data = {
                'user_id': user.user_id,
                'project': project_data
            }

            return jsonify(user_data)
        else:
            # If project_id is not provided, retrieve all projects and their tasks
            projects = Project.query.filter_by(user_id=user_id).all()

            project_list = []
            for project in projects:
                project_data = {
                    'project_id': project.project_id,
                    'title': project.title,
                    'tasks': []
                }

                for task in project.tasks:
                    task_data = {
                        'task_id': task.task_id,
                        'description': task.description,
                        'status': task.status
                    }
                    project_data['tasks'].append(task_data)

                project_list.append(project_data)

            user_data = {
                'user_id': user.user_id,
                'projects': project_list
            }

            return jsonify(user_data)

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400


# Endpoint to create a new project for a user (POST)


@app.route('/projects/<user_id>', methods=['POST'])
def create_project(user_id):
    try:
        data = request.json

        if not data:
            return jsonify({'message': 'Invalid request body'}), 400

        title = data.get('title')
        if not title:
            return jsonify({'message': 'Project title is required'}), 400

        user = User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        # Create a new project with a random UUID
        project_id = str(uuid.uuid4())
        new_project = Project(project_id=project_id,
                              title=title, user_id=user_id)
        db.session.add(new_project)
        db.session.commit()

        response_data = {
            'project_id': project_id,
            'tasks': [],
            'title': title,
            'user_id': user_id
        }

        return jsonify(response_data), 201  # Return 201 Created

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400


# Endpoint to update a project and its tasks (PUT)


@app.route('/projects/<user_id>', methods=['PUT'])
def update_project(user_id):
    try:
        project_id = request.args.get('project_id')

        if not project_id:
            return jsonify({'message': 'Project ID is required'}), 400

        data = request.json

        if not data:
            return jsonify({'message': 'Invalid request body'}), 400

        title = data.get('title')

        if not title:
            return jsonify({'message': 'Project title is required'}), 400

        user = User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        project = Project.query.filter_by(
            user_id=user_id, project_id=project_id).first()

        if project is None:
            return jsonify({'message': 'Project not found'}), 404

        project.title = title
        db.session.commit()

        return jsonify({
            'message': 'Project updated',
            'project_id': project_id,
            'title': title,
            'user_id': user_id
        }), 200

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400


# Endpoint to delete a project and its tasks or specific tasks (DELETE)


@app.route('/projects/<user_id>', methods=['DELETE'])
def delete_project(user_id):
    try:
        data = request.json

        if not data:
            return jsonify({'message': 'Invalid request body'}), 400

        project_id = data.get('project_id')

        if not project_id:
            return jsonify({'message': 'Project ID is required'}), 400

        user = User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        project = Project.query.filter_by(
            user_id=user_id, project_id=project_id).first()

        if project is None:
            return jsonify({'message': 'Project not found'}), 404

        # Delete all tasks associated with the project
        Task.query.filter_by(project_id=project_id).delete()

        # Delete the project itself
        db.session.delete(project)
        db.session.commit()

        return jsonify({'message': 'Project and tasks deleted'}), 204

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400
    except IntegrityError as e:
        return jsonify({'message': 'Integrity constraint violation'}), 400

# Endpoint to create new task based on user_id and project_id


@app.route('/tasks/<user_id>', methods=['POST'])
def create_task(user_id):
    try:
        data = request.json

        if not data:
            return jsonify({'message': 'Invalid request body'}), 400

        project_id = data.get('project_id')
        task_data = data.get('task')

        if not project_id:
            return jsonify({'message': 'Project ID is required'}), 400

        if not task_data or not isinstance(task_data, dict):
            return jsonify({'message': 'Task data is required and should be a dictionary'}), 400

        description = task_data.get('description')
        status = task_data.get('status')

        if not description:
            return jsonify({'message': 'Task description is required'}), 400

        if status not in ['todo', 'doing', 'done']:
            return jsonify({'message': 'Invalid task status'}), 400

        user = User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        project = Project.query.filter_by(
            user_id=user_id, project_id=project_id).first()

        if project is None:
            return jsonify({'message': 'Project not found'}), 404

        # Create a new task with a random UUID
        task_id = str(uuid.uuid4())
        new_task = Task(
            task_id=task_id,
            description=description,
            status=status,
            project_id=project_id,
            user_id=user_id
        )
        db.session.add(new_task)
        db.session.commit()

        response_data = {
            'project_id': project_id,
            'task': {
                'task_id': task_id,
                'description': description,
                'status': status
            }
        }

        return jsonify(response_data), 201  # Return 201 Created

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400

# Endpoint to update a task based on user_id, project_id, and task_id


@app.route('/tasks/<user_id>', methods=['PUT'])
def update_task(user_id):
    try:
        data = request.json

        if not data:
            return jsonify({'message': 'Invalid request body'}), 400

        project_id = data.get('project_id')
        task_data = data.get('task')

        if not project_id:
            return jsonify({'message': 'Project ID is required'}), 400

        if not task_data or not isinstance(task_data, dict):
            return jsonify({'message': 'Task data is required and should be a dictionary'}), 400

        task_id = task_data.get('task_id')
        description = task_data.get('description')
        status = task_data.get('status')

        if not task_id:
            return jsonify({'message': 'Task ID is required'}), 400

        if not description:
            return jsonify({'message': 'Task description is required'}), 400

        if status not in ['todo', 'doing', 'done']:
            return jsonify({'message': 'Invalid task status'}), 400

        user = User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        project = Project.query.filter_by(
            user_id=user_id, project_id=project_id).first()

        if project is None:
            return jsonify({'message': 'Project not found'}), 404

        task = Task.query.filter_by(
            task_id=task_id, project_id=project_id).first()

        if task is None:
            return jsonify({'message': 'Task not found'}), 404

        task.description = description
        task.status = status
        db.session.commit()

        response_data = {
            'project_id': project_id,
            'task': {
                'task_id': task_id,
                'description': description,
                'status': status
            }
        }

        return jsonify(response_data), 200

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400


# Endpoint to delete a task based on user_id, project_id, and task_id


@app.route('/tasks/<user_id>', methods=['DELETE'])
def delete_task(user_id):
    try:
        data = request.json

        if not data:
            return jsonify({'message': 'Invalid request body'}), 400

        project_id = data.get('project_id')
        task_id = data.get('task_id')

        if not project_id or not task_id:
            return jsonify({'message': 'Both project_id and task_id are required'}), 400

        user = User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        project = Project.query.filter_by(
            user_id=user_id, project_id=project_id).first()

        if project is None:
            return jsonify({'message': 'Project not found'}), 404

        task = Task.query.filter_by(
            project_id=project_id, task_id=task_id).first()

        if task is None:
            return jsonify({'message': 'Task not found'}), 404

        # Delete the task
        db.session.delete(task)
        db.session.commit()

        return jsonify({'message': 'Task deleted'}), 204

    except DataError as e:
        return jsonify({'message': 'Invalid UUID format'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0')
