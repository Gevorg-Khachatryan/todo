from app import db


class Todo(db.Document):
    title = db.StringField()
    desc = db.StringField()
    completed = db.BoolField(default=False)

    def to_dict(self):
        return {
            "id": self.mongo_id,
            "title": self.title,
            "desc": self.desc,
            "completed": self.completed,
        }
