from app import db


class Todo(db.Document):
    id = db.ObjectIdField().gen()
    title = db.StringField()
    desc = db.StringField()

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "desc": self.desc,
        }
