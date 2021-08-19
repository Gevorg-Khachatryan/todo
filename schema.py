from graphene import ObjectType, Schema
import graphene


class Todo(ObjectType):
    id = graphene.ID()
    title = graphene.String()
    desc = graphene.String()
    completed = graphene.Boolean()


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


class TodoInput(graphene.InputObjectType):
    id = graphene.String()
    title = graphene.String()
    desc = graphene.String()


class CreateTodo(graphene.Mutation):
    class Arguments:
        todo = TodoInput()

    Output = Todo

    def mutate(root, info,todo):
        print('////////////////////////1')
        new_todo = TodoModel(title=todo.title, desc=todo.desc)
        new_todo.save()
        return new_todo


class UpdateTodo(graphene.Mutation):
    class Arguments:
        # id = graphene.String()
        todo = TodoInput()

    Output = Todo

    def mutate(root, info, todo):
        print('////////////////////////2')
        todo_instance = TodoModel.query.get(todo.id)
        print(todo_instance.title)
        todo_instance.title = todo.title
        print(todo_instance.title)
        todo_instance.desc = todo.desc
        todo_instance.save()
        return todo_instance


class Mutation(graphene.ObjectType):
    create_todo = CreateTodo.Field()
    update_todo = UpdateTodo.Field()


schema = Schema(query=Query, mutation=Mutation)
print(schema)

query = """
  query AllPosts {
  listTodos {
    success
    errors
    post {
      id
      title 
      desc
    }
  }
}
"""
mutation = """
            mutation newTodo {
              createTodo(todo: {title:"Go to the dentist", desc:"24-10-2020"}) {
                    title
              }
            }
"""


def test_query():
    result = schema.execute(query)
    assert not result.errors
    # assert result.data == {"address": {"latlng": "(32.2,12.0)"}}
    print(result.data)


def test_mutation():
    result = schema.execute(mutation)
    # assert not result.errors
    # assert result.data == {"createAddress": {"latlng": "(32.2,12.0)"}}
    print(result.errors,'errors')
    print(result.data)
#
# test_mutation()
# test_query()