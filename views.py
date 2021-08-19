from flask import render_template
from app import app
from models import Todo
from flask import request, jsonify
from schema import schema


@app.route('/')
def list_view():
    todos = Todo.query.all()
    return render_template('index.html', todos=todos)


# @app.route('/add_item')
# def add_item():
#     todo = Todo(title='test', desc='desc')
#     todo.save()
#     return render_template('index.html', todos=Todo.query.all())
#
#
# @app.route("/update_item/<int:todoId>")
# def update_one(todoId, **kwargs):
#     item = Todo.query.get(id=todoId)
#     for key in kwargs.keys():
#         setattr(item, key, kwargs[key])
#     return item


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    print(data.get('mutation'))
    result = schema.execute(data.get('query') or data.get('mutation'), context=Todo.query.all())
    status_code = 200 if result else 400
    return jsonify(result.data), status_code
