from flask import Flask, jsonify, request,Blueprint
from database import db
from models import User
# --- ROUTES ---

user_bp = Blueprint('user_bp',__name__,url_prefix="/")

## USERS CRUD
@user_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name,"email":u.email} for u in users])


@user_bp.route("/users/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify({"id": user.id, "name": user.name,"email":user.email})


@user_bp.route("/user", methods=["POST"])
def create_user():
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "Missing 'name'"}), 400
    new_user = User(name=data["name"],password =data['password'], email=data["email"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"id": new_user.id, "name": new_user.name,"email" :new_user.email}), 201


@user_bp.route("/users/<int:id>", methods=["PUT"])
def update_user_name(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.name = data.get("name", user.name)
    db.session.commit()
    return jsonify({"id": user.id, "name": user.name})


@user_bp.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user.name}  deleted"})




