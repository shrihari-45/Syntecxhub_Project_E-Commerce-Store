from flask import Blueprint, request
from bson import ObjectId
from datetime import datetime, timezone
from backend.app.services.db import get_db, persist_state
from backend.app.models.order import ORDER_STATUSES
from backend.app.utils.serializers import serialize_doc, serialize_docs
from backend.app.utils.responses import success_response, error_response
from backend.app.middleware.auth import admin_required

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

def _parse_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return id_str

@admin_bp.route("/dashboard", methods=["GET"])
@admin_required
def get_dashboard_summary(current_user):
    db = get_db()

    total_products = db.products.count_documents({})
    total_orders = db.orders.count_documents({})
    total_customers = db.users.count_documents({"role": "customer"})

    # Compute total revenue
    all_orders = list(db.orders.find({}))
    total_sales = sum(
        float(order.get("total_amount", 0.0))
        for order in all_orders
        if order.get("order_status") != "Cancelled"
    )

    # Status breakdown
    status_counts = {}
    for st in ORDER_STATUSES:
        status_counts[st] = sum(1 for o in all_orders if o.get("order_status") == st)

    # 5 most recent orders
    recent_orders = list(db.orders.find({}).sort("created_at", -1).limit(5))

    # Low stock alerts (stock < 5)
    low_stock_products = list(db.products.find({"stock": {"$lte": 5}}).limit(10))

    return success_response({
        "stats": {
            "total_sales": round(total_sales, 2),
            "total_orders": total_orders,
            "total_products": total_products,
            "total_customers": total_customers
        },
        "status_counts": status_counts,
        "recent_orders": serialize_docs(recent_orders),
        "low_stock_products": serialize_docs(low_stock_products)
    }, "Dashboard metrics retrieved successfully")

@admin_bp.route("/orders", methods=["GET"])
@admin_required
def get_all_orders(current_user):
    db = get_db()
    query = {}

    status = request.args.get("status")
    if status and status.lower() != "all":
        query["order_status"] = status

    search = request.args.get("search", "").strip()
    if search:
        query["$or"] = [
            {"customer_name": {"$regex": search, "$options": "i"}},
            {"customer_email": {"$regex": search, "$options": "i"}}
        ]
        # Also match ID if search looks like hex or exact
        try:
            query["$or"].append({"_id": ObjectId(search)})
        except Exception:
            pass

    orders = list(db.orders.find(query).sort("created_at", -1))
    return success_response({"orders": serialize_docs(orders)}, "Orders retrieved successfully")

@admin_bp.route("/orders/<order_id>/status", methods=["PUT"])
@admin_required
def update_order_status(current_user, order_id):
    data = request.get_json() or {}
    new_status = data.get("status")

    if not new_status or new_status not in ORDER_STATUSES:
        return error_response(
            f"Invalid status. Must be one of: {', '.join(ORDER_STATUSES)}",
            400
        )

    db = get_db()
    obj_id = _parse_id(order_id)
    order = db.orders.find_one({"$or": [{"_id": obj_id}, {"_id": order_id}]})
    if not order:
        return error_response("Order not found.", 404)

    db.orders.update_one(
        {"$or": [{"_id": obj_id}, {"_id": order_id}]},
        {"$set": {"order_status": new_status, "updated_at": datetime.now(timezone.utc)}}
    )
    persist_state()

    updated = db.orders.find_one({"$or": [{"_id": obj_id}, {"_id": order_id}]})
    return success_response({"order": serialize_doc(updated)}, f"Order status updated to {new_status}")

@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users(current_user):
    db = get_db()
    users = list(db.users.find({}, {"password": 0}).sort("created_at", -1))
    
    # Enrich with order count
    serialized_users = serialize_docs(users, hide_password=True)
    for u in serialized_users:
        u["orders_count"] = db.orders.count_documents({"user_id": u["id"]})

    return success_response({"users": serialized_users}, "Users retrieved successfully")
