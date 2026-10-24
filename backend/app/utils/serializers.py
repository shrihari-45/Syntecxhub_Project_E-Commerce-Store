from bson import ObjectId
from datetime import datetime

def serialize_doc(doc, hide_password=True):
    """Convert MongoDB document to JSON-serializable dictionary."""
    if not doc:
        return None
    d = dict(doc)
    if "_id" in d:
        d["id"] = str(d["_id"])
        del d["_id"]
    if hide_password and "password" in d:
        del d["password"]
    for k, v in d.items():
        if isinstance(v, ObjectId):
            d[k] = str(v)
        elif isinstance(v, datetime):
            d[k] = v.isoformat()
        elif isinstance(v, list):
            d[k] = [
                serialize_doc(item, hide_password=hide_password) if isinstance(item, dict)
                else str(item) if isinstance(item, ObjectId)
                else item.isoformat() if isinstance(item, datetime)
                else item
                for item in v
            ]
        elif isinstance(v, dict):
            d[k] = serialize_doc(v, hide_password=hide_password)
    return d

def serialize_docs(docs, hide_password=True):
    """Serialize a list of MongoDB documents."""
    return [serialize_doc(d, hide_password=hide_password) for d in docs]
