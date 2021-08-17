from flask import render_template
from app import app
from models import Todo
from ariadne import load_schema_from_path, make_executable_schema, \
    graphql_sync, snake_case_fallback_resolvers, ObjectType
from ariadne.constants import PLAYGROUND_HTML
from flask import request, jsonify, json

from api.queries import listTodos_resolver


@app.route('/')
def list_view():
    todos = Todo.query.all()
    return render_template('index.html', todos=todos)


@app.route('/add_item')
def add_item():
    todo = Todo(title='test', desc='desc')
    todo.save()
    return render_template('index.html', todos=Todo.query.all())


@app.route("/graphql", methods=["GET"])
def graphql_playground():
    return (PLAYGROUND_HTML, 200)


@app.route("/update_item/<int:todoId>")
def update_one(todoId, **kwargs):
    item = Todo.query.get(id=todoId)
    for key in kwargs.keys():
        setattr(item, key, kwargs[key])
    return item


query = ObjectType("Query")
query.set_field("listTodos", listTodos_resolver)

type_defs = load_schema_from_path("schema.graphql")
schema = make_executable_schema(
    type_defs, query, snake_case_fallback_resolvers
)


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code