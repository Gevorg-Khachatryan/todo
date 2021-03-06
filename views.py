from flask import render_template
from app import app
from models import Todo
from flask import request, jsonify
from schema import schema


# @app.route('/')
# def list_view():
#     todos = Todo.query.all()
#     return render_template('index.html', todos=todos)


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    result = schema.execute(data.get('query'), context=Todo.query.all(),info=data.get('type'))
    status_code = 200 if result else 400
    return jsonify(result.data), status_code
