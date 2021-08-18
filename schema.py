from graphene import ObjectType, Schema
import graphene


class Todo(ObjectType):
    id = graphene.ID()
    title = graphene.String()
    desc = graphene.String()


class TodosResult(ObjectType):
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    post = graphene.List(Todo)


class TodoResult(ObjectType):
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    post = graphene.Field(Todo)
from models import Todo as TodoModel


class Query(ObjectType):

    list_todos = graphene.Field(TodosResult)
    get_todo = graphene.Field(TodoResult, id=graphene.ID(required=True))

    def resolve_list_todos(root, info):
        print(info.context,'???????????????????????????????????')
        try:
            todos = [todo.to_dict() for todo in TodoModel.query.all()]
            payload = {
                "success": True,
                "post": todos,
            }
        except Exception as error:
            payload = {
                "success": False,
                "errors": [str(error)]
            }
        return payload

    def resolve_get_todo(root, info, id):
        print(id, root, info,'//////////////////////////////////////////////////////////////////////////////////')
        try:
            todo = TodoModel.query.get(id)

            payload = {
                "success": True,
                "post": todo.to_dict()
            }
        except AttributeError as e:  # todo not found
            print(e)
            payload = {
                "success": False,
                "errors": [f"Todo item matching {id} not found"]
            }
        return payload


schema = Schema(query=Query)
print(schema)
