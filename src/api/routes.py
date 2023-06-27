"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Customer, Employee, Ticket, Equipment, Malfunction, Knowledge, TicketKnowledge, TicketEmployeeRelation, Vehicle, Category
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import datetime


api = Blueprint('api', __name__)

#TODO: REFACTOR HTTP REQUEST CODES

@api.route('/token', methods=['POST'])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).first()

    if not user:
        return jsonify({"msg": "Bad username or password"}), 401

    if not user.active:
        return jsonify({"msg": "User no longer avaliable"}), 401

    access_token = create_access_token(
        identity=user.email, expires_delta=datetime.timedelta(hours=1))

    return jsonify({'access_token': access_token, 'user_type': user.user_type.type}), 200


@api.route('/customer/equipment', methods=['GET'])
@jwt_required()
def get_customer_equipments():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "Unauthorized access!"}), 401

    equipments = Equipment.query.filter_by(customer_id=user.customer_id).all()

    if not equipments:
        return jsonify({"msg": "No equipments for that customer!"}), 400

    response_body = {
        "equipments": [equipment.serialize() for equipment in equipments]
    }
    return jsonify(response_body), 200


@api.route('/customer/tickets', methods=['GET'])
@jwt_required()
def get_tickets():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "Unauthorized access!"}), 401

    tickets = Ticket.query.filter_by(customer_id=user.customer_id).all()

    if not tickets:
        return jsonify({"msg": "No tickets for this customer!"}), 400

    response_body = {
        "tickets": [ticket.serialize_cus() for ticket in tickets]
    }
    return jsonify(response_body), 200


@api.route('/customer/create/ticket', methods=['POST'])
@jwt_required()
def create_ticket():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).one_or_none()

        if not user:
            return jsonify({"msg": "Customer not found!"}), 401

        data = request.json

        equipment_id = data["equipment_id"]
        intervention_type = data["intervention_type"]
        subject = data['subject']
        description = data["description"]

        ticket = Ticket()
        ticket.customer_id = user.customer_id
        ticket.equipment_id = equipment_id
        ticket.intervention_type = intervention_type
        ticket.subject = subject
        ticket.description = description
        ticket.status = "Opened"
        ticket.open_ticket_time = datetime.datetime.now()
        db.session.add(ticket)

        db.session.commit()

        new_ticket = Ticket.query.get(ticket.id)

        response_ticket = new_ticket.serialize_cus()

        return jsonify({"msg": "Ticket created successfully", "ticket": response_ticket}), 201
    except Exception as e:
        print(e.args)
        return jsonify({"msg": "Exception"}), 400


@api.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "Unauthorized access!"}), 401

    user_profile = {}
    user_profile['user_info'] = user.serialize()
    if user.customer_id:
        user_profile['customer_info'] = Customer.query.get(
            user.customer_id).serialize()
    elif user.employee_id:
        user_profile['employee_info'] = Employee.query.get(
            user.employee_id).serialize()

    response_body = {"user_profile": user_profile}
    return jsonify(response_body), 200


@api.route('/user/profile/update', methods=['PUT'])
@jwt_required()
def updateProfile():
    data = request.json
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "User profile not found"}), 401

    try:
        if 'user_info' in data:
            for k, v in data['user_info'].items():
                setattr(user, k, v)

        if 'customer_info' in data:
            for k, v in data['customer_info'].items():
                setattr(user.customer, k, v)

        if 'employee_info' in data:
            for k, v in data['employee_info'].items:
                setattr(user.employee, k, v)

        db.session.commit()

        return jsonify({"msg": "Profile updated successfully"}), 200

    except Exception as e:
        return jsonify({"msg": "Something went wrong when updating profile"}), 400


@api.route('/admin/tickets', methods=['GET'])
@jwt_required()
def get_tickets_not_closed():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


    tickets = Ticket.query.filter(Ticket.status.in_(
        ['Opened', 'In Progress', 'Resolved'])).all()

    if not tickets:
        return jsonify({"msg": "No tickets to manage"}), 400

    response_body = {
        "tickets": [ticket.serialize_cus() for ticket in tickets]
    }
    return jsonify(response_body), 200


@api.route('/assign/employee/ticket', methods=['POST'])
@jwt_required()
def assign_ticket():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


    data = request.get_json()

    # TODO: remove this comment lines
    # DON'T NEED THIS VALIDATION. WE DO THE QUERY.
    # IF TICKET OR EMPLOYEES GIVE AN ERROR THEN AN ERROR MESSAGE IS RETURNED
    
    # ticket_id = data['ticket_id']
    # employee_ids = data['employee_ids']

    # if not ticket_id or not employee_ids:
    #     return jsonify({"msg": "Ticket or Employee ID is wrong or doesn't exist"}), 401

    ticket = Ticket.query.get(data['ticket_id'])
    employees = Employee.query.filter(Employee.id.in_(data['employee_ids'])).all()

    if not ticket:
        return jsonify({'msg': 'Ticket not found'}), 401
    if not employees:
        return jsonify({'msg': 'Employee(s) not found'}), 401

    for employee in employees:
        # set employee has not available
        employee.available = False
        db.session.add(employee)

        # assign employee to ticket 
        ticket_employee_relation = TicketEmployeeRelation(
            ticket_id=ticket.id,
            employee_id=employee.id
        )
        db.session.add(ticket_employee_relation)
    db.session.commit()

    return jsonify({'msg': 'Employee(s) assigned successfully to ticket'}), 200


@api.route('/admin/equipment', methods=['POST'])
@jwt_required()
def create_equipment():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


    data = request.json
    if not data:
        return jsonify({'msg': 'No data provided'}), 400

    equipment = Equipment()
    equipment.serial_number = data.get('serial_number')
    equipment.model = data.get('model')
    equipment.im109 = data.get('im109')

    db.session.add(equipment)
    db.session.commit()

    return jsonify({'msg': 'Equipment created'}), 201


@api.route('/admin/equipment/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_equipment_by_customer_id(customer_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({'msg': 'customer_id parameter is missing'}), 400

    equipments = Equipment.query.filter_by(customer_id=customer_id).all()
    print("#################")
    print(customer_id)
    print(equipments)
    print("#################")

    return jsonify({"equipments": [equipment.serialize() for equipment in equipments]}), 200


@api.route('/employees/available', methods=['GET'])
@jwt_required()
def get_available_employees():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


    available_employees = Employee.query.filter_by(available=True).all()
    serialized_employees = [e.serialize() for e in available_employees]

    return jsonify(serialized_employees), 200


@api.route('/admin/equipments', methods=['GET'])
@jwt_required()
def get_all_equipments():
    # IF OTHERS EMPLOYEE'S NEED TO GET ALL EQUIPMENTS REMOVE FROM THIS LINE TO NEXT COMMENTED LINE
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403

    # #####################################

    equipments = Equipment.query.all()
    response_body = {
        "equipments": [equipment.serialize() for equipment in equipments]
    }

    return jsonify(response_body), 200


@api.route('/vehicles', methods=['GET'])
@jwt_required()
def get_all_vehicles():
    # IF OTHERS EMPLOYEE'S NEED TO GET ALL EQUIPMENTS REMOVE FROM THIS LINE TO NEXT COMMENTED LINE
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403

    # #####################################

    vehicles = Vehicle.query.all()
    serialized_vehicles = [v.serialize() for v in vehicles]

    return jsonify(serialized_vehicles), 200


@api.route('/admin/vehicles/available', methods=['GET'])
@jwt_required()
def get_available_vehicles():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 400

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403

    
    available_vehicles = Vehicle.query.filter_by(available=True).all()
    serialized_vehicle = [e.serialize() for e in available_vehicles]

    return jsonify(serialized_vehicle), 200


@api.route('/admin/vehicles/available', methods=['PUT'])
@jwt_required()
def set_available_vehicle():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 400

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403

    
    data = request.json

    vehicle = Vehicle.query.get(data['vehicle_id'])

    if not vehicle:
        return jsonify({'msg': 'No vehicle found with this id'}), 400

    vehicle.available = data['availability']
    db.session.commit()
    
    return jsonify({'msg': 'Availability update is done!'}), 200


@api.route('/admin/edit/user', methods=['PUT'])
@jwt_required()
def admin_edit_user():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


    data = request.json

    user_to_edit = User.query.get(data['user_id'])
    
    if user_to_edit:
        return jsonify({'msg': 'No user found to edit'}), 404

    if user_to_edit.id == user.id:
        return jsonify({'msg': 'You can not set yourself to inactive'})

    if user_to_edit.active:
        user_to_edit.active = False
        db.session.commit()
        return jsonify({'msg': 'User set to inactive'}), 200

    return jsonify({'msg': 'User already set to inactive'}), 200


@api.route('/admin/create/ticket', methods=['POST'])
@jwt_required()
def admin_create_ticket():
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).one_or_none()

        if not user:
            return jsonify({"msg": "No user exist with that email"}), 401

        if user.user_type.type != "admin":
            return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


        data = request.json

        equipment_id = data["equipment_id"]
        intervention_type = data["intervention_type"]
        subject = data['subject']
        description = data["description"]
        customer_id = data["customer_id"]

        ticket = Ticket()
        ticket.customer_id = customer_id
        ticket.equipment_id = equipment_id
        ticket.intervention_type = intervention_type
        ticket.subject = subject
        ticket.description = description
        ticket.status = "Opened"
        ticket.open_ticket_time = datetime.datetime.now()
        db.session.add(ticket)

        db.session.commit()

        return jsonify({"msg": "Ticket created successfully"}), 201
    except Exception as e:
        print(e.args)
        return jsonify({"msg": "Exception"}), 400


@api.route('/admin/user/list', methods=['GET'])
@jwt_required()
def get_user_list():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    if user.user_type.type != "admin":
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403

    
    users = User.query.all()
    response_body = {
        "users": [user.serialize_admin() for user in users]
    }

    return jsonify(response_body), 200


@api.route('/admin/user/update', methods=['PUT'])
@jwt_required()
def update_user():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).one_or_none()

    if not user:
        return jsonify({"msg": "User not found"}), 401

    if user.user_type.type != 'admin':
        return jsonify({"msg": "Forbiden. Only admins can update users"}), 403

    try:
        data = request.json

        user_to_update = User.query.get(data['user_info']['user_id'])
        if not user_to_update:
            return jsonify({"msg": "User not found"}), 404

        if 'user_info' in data:
            for k, v in data['user_info'].items():
                setattr(user_to_update, k, v)

        if 'customer_info' in data:
            for k, v in data['customer_info'].items():
                setattr(user_to_update.customer, k, v)

        if 'employee_info' in data:
            for k, v in data['employee_info'].items():
                setattr(user_to_update.employee, k, v)

        db.session.commit()

        return jsonify({"msg": "User updated successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"msg": "Something went wrong when trying to update user"}), 400


@api.route('/admin/tickets/<int:ticket_id>', methods=['GET'])
@jwt_required()
def manage_ticket(ticket_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).one_or_none()

    if not user:
        return jsonify({"msg": "User not found"}), 401

    if user.user_type.type != 'admin':
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


    ticket = Ticket.query.get(ticket_id)

    if not ticket:
        return jsonify({"msg": "Ticket not found"}), 404

    return jsonify(ticket.serialize()), 200


@api.route('/admin/update/ticket', methods=['PUT'])
@jwt_required()
def admin_update_ticket():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).one_or_none()

    if not user:
        return jsonify({"msg": "User not found"}), 401

    if user.user_type.type != 'admin':
        return jsonify({"msg": "Only admins have access to this endpoint!"}), 403


    data = request.json

    ticket = Ticket.query.get(data['id'])

    if not ticket:
        return jsonify({"msg": "Ticket not found"}), 401

    if ticket.status == 'Closed':
        return jsonify({"msg": "You can not update a closed ticket!"})

    try:
        data = request.json

        if 'status' in data:
            ticket.status = data['status']
        if 'intervention_type' in data:
            ticket.intervention_type = data['intervention_type']
        if 'subject' in data:
            ticket.subject = data['subject']
        if 'description' in data:
            ticket.description = data['description']

        db.session.commit()

        return jsonify({"msg": "Ticket updated successfully"}), 200

    except Exception as e:
        return jsonify({"msg": "Something went wrong when updating the ticket"}), 400


@api.route('/employee/assigned/ticket', methods=['GET'])
@jwt_required()
def get_employee_assigned_tickets():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 401

    # get tickets assigned to employee
    assigned_tickets = TicketEmployeeRelation.query.filter_by(employee_id = user.employee_id).all()
    tickets_serialized = [ticket.serialize_employee() for ticket in assigned_tickets]

    # filter the ticket 'Opened'
    filtered_list_of_tickets = [ ticket for ticket in tickets_serialized if ticket['ticket']['status'] in ['Opened']]

    # get equipment id to get tickets created for this equipment
    equipment_id = filtered_list_of_tickets[0]['equipment']['id']

    # get tickets id
    tickets = Ticket.query.filter_by(equipment_id = equipment_id).all()
    tickets_id = [tickets_id.serialize_equipment_knowledge() for tickets_id in tickets] if tickets else []

    # get TicketKnowledges that contains tickets id from tickets_id
    knowledges = TicketKnowledge.query.filter(TicketKnowledge.ticket_id.in_(tickets_id)).all()

    # serialize Knowledges
    final = [knowledge.serialize_employee() for knowledge in knowledges]

    filtered_list_of_tickets[0]['equipment']['knowledge'] = final
    
    return jsonify(filtered_list_of_tickets[0]), 200


@api.route('/employee/categories', methods=['GET'])
@jwt_required()
def get_categories():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 400

    if user.user_type.type == "customer":
        return jsonify({"msg": "Customers don't have access to this endpoint!"}), 403

    
    categories = Category.query.all()

    return jsonify({"categories": [categorie.serialize_options() for categorie in categories]}), 200


@api.route('/knowledge/list', methods=['GET'])
@jwt_required()
def get_all_knowledges():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).one_or_none()

    if not user:
        return jsonify({"msg": "No user exist with that email"}), 400

    if user.user_type.type == "customer":
        return jsonify({"msg": "Customers don't have access to this endpoint!"}), 403

    knowledges = Knowledge.query.all()

    return jsonify({"knowledges": [knowledge.serialize() for knowledge in knowledges]}), 200