from models import Todo
import time

def listTodos_resolver(obj, info):
    try:
        todos = [todo.to_dict() for todo in Todo.query.all()]
        print(todos)
        payload = {
            "success": True,
            "posts": todos,
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    # raise ValueError('sdsdd')
    time.sleep(6)
    return payload