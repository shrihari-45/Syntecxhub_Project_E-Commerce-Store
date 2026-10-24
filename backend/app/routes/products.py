import re
from datetime import datetime, timezone
from flask import Blueprint, request
from bson import ObjectId
from backend.app.services.db import get_db, persist_state
from backend.app.models.product import ProductModel
from backend.app.utils.serializers import serialize_doc, serialize_docs
from backend.app.utils.responses import success_response, error_response
from backend.app.middleware.auth import admin_required

products_bp = Blueprint("products", __name__, url_prefix="/api/products")

def _parse_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return id_str

@products_bp.route("", methods=["GET"])
def get_products():
    db = get_db()
    query = {}

    # Category filter
    category = request.args.get("category")
    if category and category.lower() != "all":
        query["category"] = {"$regex": f"^{re.escape(category)}$", "$options": "i"}

    # Search filter (name or description)
    search = request.args.get("search", "").strip()
    if search:
        query["$or"] = [
            {"name": {"$regex": re.escape(search), "$options": "i"}},
            {"description": {"$regex": re.escape(search), "$options": "i"}},
            {"category": {"$regex": re.escape(search), "$options": "i"}}
        ]

    # Price range filter
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    if min_price or max_price:
        query["price"] = {}
        if min_price:
            try:
                query["price"]["$gte"] = float(min_price)
            except ValueError:
                pass
        if max_price:
            try:
                query["price"]["$lte"] = float(max_price)
            except ValueError:
                pass

    # Rating filter
    rating = request.args.get("rating")
    if rating:
        try:
            query["rating"] = {"$gte": float(rating)}
        except ValueError:
            pass

    # Stock availability filter
    in_stock = request.args.get("in_stock")
    if in_stock and in_stock.lower() in ("true", "1"):
        query["stock"] = {"$gt": 0}

    # Featured filter
    featured = request.args.get("featured")
    if featured and featured.lower() in ("true", "1"):
        query["is_featured"] = True

    # Sorting
    sort_param = request.args.get("sort", "featured")
    sort_criteria = [("is_featured", -1), ("_id", -1)]
    if sort_param == "price_asc":
        sort_criteria = [("price", 1)]
    elif sort_param == "price_desc":
        sort_criteria = [("price", -1)]
    elif sort_param == "rating_desc":
        sort_criteria = [("rating", -1)]
    elif sort_param == "name_asc":
        sort_criteria = [("name", 1)]
    elif sort_param == "newest":
        sort_criteria = [("created_at", -1)]

    # Pagination
    try:
        page = max(1, int(request.args.get("page", 1)))
        limit = max(1, min(100, int(request.args.get("limit", 12))))
    except ValueError:
        page = 1
        limit = 12

    skip = (page - 1) * limit
    total = db.products.count_documents(query)
    cursor = db.products.find(query).sort(sort_criteria).skip(skip).limit(limit)
    products = list(cursor)

    return success_response({
        "products": serialize_docs(products),
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if limit else 1
    }, "Products retrieved successfully")

@products_bp.route("/categories", methods=["GET"])
def get_categories():
    db = get_db()
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    try:
        results = list(db.products.aggregate(pipeline))
        categories = [{"name": r["_id"], "count": r["count"]} for r in results if r["_id"]]
    except Exception:
        # Fallback for simpler mock db
        distinct_cats = db.products.distinct("category")
        categories = [{"name": cat, "count": db.products.count_documents({"category": cat})} for cat in distinct_cats]

    return success_response({"categories": categories}, "Categories retrieved successfully")

@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):
    db = get_db()
    obj_id = _parse_id(product_id)
    product = db.products.find_one({"$or": [{"_id": obj_id}, {"_id": product_id}]})
    if not product:
        return error_response("Product not found", 404)
    return success_response({"product": serialize_doc(product)}, "Product retrieved successfully")

@products_bp.route("", methods=["POST"])
@admin_required
def create_product(current_user):
    data = request.get_json() or {}
    errors = ProductModel.validate_product(data)
    if errors:
        return error_response("Validation error", 400, errors)

    db = get_db()
    new_product = ProductModel.create_document(data)
    result = db.products.insert_one(new_product)
    persist_state()

    created = serialize_doc(new_product)
    created["id"] = str(result.inserted_id)
    return success_response({"product": created}, "Product created successfully", 201)

@products_bp.route("/<product_id>", methods=["PUT"])
@admin_required
def update_product(current_user, product_id):
    data = request.get_json() or {}
    db = get_db()
    obj_id = _parse_id(product_id)
    existing = db.products.find_one({"$or": [{"_id": obj_id}, {"_id": product_id}]})
    if not existing:
        return error_response("Product not found", 404)

    errors = ProductModel.validate_product(data)
    if errors:
        return error_response("Validation error", 400, errors)

    updated_fields = ProductModel.create_document(data)
    updated_fields["updated_at"] = datetime.now(timezone.utc)

    db.products.update_one(
        {"$or": [{"_id": obj_id}, {"_id": product_id}]},
        {"$set": updated_fields}
    )
    persist_state()

    updated = db.products.find_one({"$or": [{"_id": obj_id}, {"_id": product_id}]})
    return success_response({"product": serialize_doc(updated)}, "Product updated successfully")

@products_bp.route("/<product_id>", methods=["DELETE"])
@admin_required
def delete_product(current_user, product_id):
    db = get_db()
    obj_id = _parse_id(product_id)
    res = db.products.delete_one({"$or": [{"_id": obj_id}, {"_id": product_id}]})
    if res.deleted_count == 0:
        return error_response("Product not found", 404)

    persist_state()
    return success_response(None, "Product deleted successfully")
