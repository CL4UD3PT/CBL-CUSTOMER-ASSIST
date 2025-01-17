from flask_sqlalchemy import SQLAlchemy
import base64

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)
    user_type_id = db.Column(db.Integer, db.ForeignKey(
        'user_type.id'), nullable=False)
    customer_id = db.Column(
        db.Integer, db.ForeignKey('customer.id'), nullable=True)
    employee_id = db.Column(
        db.Integer, db.ForeignKey('employee.id'), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "password": self.password,
            "active": self.active,
            "user_type_id": self.user_type_id,
            "user_type": self.user_type.type,
            "customer_id": self.customer_id,
            "employee_id": self.employee_id
        }

    def serialize_admin(self):
        data = {
            "id": self.id,
            "email": self.email,
            "active": self.active,
            "user_type_id": self.user_type_id,
            "user_type": self.user_type.type,
            "customer_id": self.customer_id,
            "employee_id": self.employee_id
        }
        if self.customer:
            data["company_name"] = self.customer.company_name
        return data

    def serialize_available(self):
        if self.employee.available:
            return {
                "id": self.employee.id,
                "first_name": self.employee.first_name,
                "last_name": self.employee.last_name,
                "value": self.employee.id,
                "label": self.employee.first_name + " " + self.employee.last_name
            }
    
    def serialize_employee(self):
        password = self.password
        password_bytes = password.encode('ascii')
        base64_bytes = base64.b64encode(password_bytes)
        base64_password = base64_bytes.decode('ascii')
        return {
            "user_email": self.email,
            "password": base64_password
        }
        
    def serialise_contact(self):
        data = {}

        if self.customer:
            data = {
                "id": self.customer.id,
                "company_name": self.customer.company_name,
                "phone": self.customer.phone,
                "contact_person": self.customer.contact_person,
                "address_1": self.customer.address_1,
                "address_2": self.customer.address_2,
                "zipcode": self.customer.zipcode,
                "city": self.customer.city,
                "company_email": self.customer.company_email
            }

        if self.employee:
            data = {
                "id": self.employee.id,
                "first_name": self.employee.first_name,
                "last_name": self.employee.last_name,
                "available": self.employee.available,
                "email": self.email,
                "role": self.user_type.type
            }

        return data
        


class UserType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    user = db.relationship('User', backref='user_type', uselist=False)


class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    available = db.Column(db.Boolean, nullable=False)
    user = db.relationship('User', backref='employee', uselist=False)
    tickets = db.relationship('TicketEmployeeRelation', backref='employee', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "available": self.available
        }

    def serialize_available(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "available": self.available,
            "value": self.id,
            "label": self.first_name + " " + self.last_name
        }

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    contact_person = db.Column(db.String(20), nullable=True)
    address_1 = db.Column(db.String(100), nullable=False)
    address_2 = db.Column(db.String(100), nullable=True)
    zipcode = db.Column(db.String(10))
    company_email = db.Column(db.String(25), nullable=True)
    city = db.Column(db.String(50), nullable=False)
    user = db.relationship('User', backref='customer', uselist=False)
    tickets = db.relationship('Ticket', backref='customer', uselist=False)
    equipments = db.relationship('Equipment', backref='customer', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "phone": self.phone,
            "contact_person": self.contact_person,
            "address_1": self.address_1,
            "address_2": self.address_2,
            "zipcode": self.zipcode,
            "city": self.city,
            "company_email": self.company_email
        }

    def serialize_employee(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "phone": self.phone,
            "contact_person": self.contact_person,
            "address_1": self.address_1,
            "address_2": self.address_2,
            "zipcode": self.zipcode,
            "city": self.city,
            "company_email": self.company_email,
            "customer_email": self.user.email,
        }


class TicketEmployeeRelation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    observations = db.Column(db.String(1024), nullable=True)
    start_intervention_date = db.Column(db.DateTime)
    end_intervention_date = db.Column(db.DateTime)

    def serialize(self):
        return {
            "id": self.id,
            "ticket_id": self.ticket_id,
            "employee_id": self.employee_id,
            "start_intervention_date": self.start_intervention_date,
            "end_intervention_date": self.end_intervention_date,
            "observations": self.observations
        }

    def serialize_employee(self):
        return self.ticket.serialize_employee()
    
    def serialize_employee_assigned(self):
        employee = self.employee.serialize_available()

        return employee


class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(30), nullable=False)
    intervention_type = db.Column(db.Boolean, nullable=True)
    open_ticket_time = db.Column(db.DateTime, nullable=False)
    leave_manufacturer_time = db.Column(db.DateTime, nullable=True)
    closed_ticket_time = db.Column(db.DateTime, nullable=True)
    km_on_leave = db.Column(db.Integer, nullable=True)
    km_on_arrival = db.Column(db.Integer, nullable=True)
    subject = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(1024), nullable=False)
    customer_media = db.Column(db.String, nullable=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=True)
    ticket_knowledge = db.relationship('TicketKnowledge', backref='ticket')
    ticket_employees = db.relationship('TicketEmployeeRelation', backref='ticket')

    def serialize(self):
        return {
            "id": self.id,
            "open_ticket_time": self.open_ticket_time,
            "equipment": self.equipment.serialize(),
            "status": self.status,
            "intervention_type": self.intervention_type,
            "subject": self.subject,
            "description": self.description,
            "customer_id": self.customer_id,
            "company_name": self.customer.company_name,
            "customer_media": self.customer_media.split(',') if self.customer_media else ""
        }

    def serialize_cus(self):
        equipment = self.equipment.serialize()
        equipment_knowledge = TicketKnowledge.query.filter_by(equipment_id=self.equipment_id).all()
        equipment['knowledge'] = [knowledge.serialize() for knowledge in equipment_knowledge] if equipment_knowledge else []

        return {
            "id": self.id,
            "open_ticket_time": self.open_ticket_time,
            "equipment": equipment,
            "status": self.status,
            "intervention_type": self.intervention_type,
            "subject": self.subject,
            "description": self.description,
            "customer_id": self.customer_id,
            "customer_media": self.customer_media.split(',') if self.customer_media else "",
            "company_name": self.customer.company_name,
            "knowledge": [knowledge.serialize() for knowledge in self.ticket_knowledge] if self.ticket_knowledge else [],
            "employees_assigned": [employees.serialize_employee_assigned() for employees in self.ticket_employees] if self.ticket_employees else [],
            "ticket_employee": [employee.serialize() for employee in self.ticket_employees] if self.ticket_employees else [],
            "vehicle_assigned": self.vehicle.serialize() if self.vehicle else {},
            "customer_info": self.customer.serialize() if self.customer else {},
            "km_on_leave": self.km_on_leave,
            "km_on_arrival": self.km_on_arrival
            # "employees_assigned": self.ticket_employees.serialize_employee_assigned() if self.ticket_employees else None
        }

    def serialize_employee(self):
        return {
            "ticket": {
                "id": self.id,
                "open_ticket_time": self.open_ticket_time,
                "status": self.status,
                "intervention_type": self.intervention_type,
                "subject": self.subject,
                "description": self.description,
                "customer_media": self.customer_media.split(',') if self.customer_media else ""
            },
            "customer": self.customer.serialize_employee(),
            "equipment": self.equipment.serialize_employee(),
            "vehicle_assigned": self.vehicle.serialize() if self.vehicle else {},
            "ticket_employee": [employee.serialize() for employee in self.ticket_employees] if self.ticket_employees else [],
        }

    def serialize_equipment_knowledge(self):
        # knowledges = [knowledge.serialize_employee() for knowledge in self.ticket_knowledge] if self.ticket_knowledge else []
        return self.id


class TicketKnowledge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    knowledge_id = db.Column(db.Integer, db.ForeignKey('knowledge.id'), nullable=False)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'), nullable=False)
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.id'), nullable=False)

    def serialize(self):
        knowledge = Knowledge.query.get(self.knowledge_id)
        return {
            "id": self.id,
            # "knowledge": knowledge.serialize_full() if knowledge else None
            "category": self.knowledge.category.serialize() if self.knowledge.category else None,
            "malfunction": self.knowledge.malfunction.serialize() if self.knowledge.malfunction else None,
            "solution": self.knowledge.solution.serialize() if self.knowledge.solution else None
        }

    def serialize_employee(self):
        return {
            "id": self.id,
            "category": self.knowledge.category.serialize() if self.knowledge.category else None,
            "malfunction": self.knowledge.malfunction.serialize() if self.knowledge.malfunction else None,
            "solution": self.knowledge.solution.serialize() if self.knowledge.solution else None
        }


class Knowledge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    malfunction_id = db.Column(db.Integer, db.ForeignKey('malfunction.id'), nullable=False)
    solution_id = db.Column(db.Integer, db.ForeignKey('solution.id'), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    ticket_knowledge = db.relationship('TicketKnowledge', backref='knowledge', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "malfunction": self.malfunction.description,
            "solution": self.solution.description,
            "category": self.category.description
        }

    def serialize_full(self):

        solution = Solution.query.get(self.solution_id)
        category = Category.query.get(self.category_id)
        malfunction = Malfunction.query.get(self.malfunction_id)
        return {
            "id": self.id,
            "solution": solution.serialize() if solution else None,
            "category": category.serialize() if category else None,
            "malfunction": malfunction.serialize() if malfunction else None
        }


class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    serial_number = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    im109 = db.Column(db.String(50), nullable=True)
    equipment_photo = db.Column(db.String, nullable=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=True)
    tickets = db.relationship('Ticket', backref='equipment', uselist=False)
    ticket_knowledge = db.relationship('TicketKnowledge', backref='equipment', uselist=False)

    def __repr__(self):
        return f"<Equipment {self.model}>"

    def serialize(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "serial_number": self.serial_number,
            "model": self.model,
            "im109": self.im109,
            "equipment_photo": self.equipment_photo
        }

    def serialize_employee(self):
        # tickets = Ticket.query.filter_by(equipment_id = self.id).all()
        # knowledge = [knowledge.serialize_equipment_knowledge() for knowledge in tickets] if tickets else []
        # print("############################")
        # print(knowledge)
        # print("$$$$$$$$$$$$$$$$$$$$$$$$$$")
        return {
            "id": self.id,
            "serial_number": self.serial_number,
            "model": self.model,
            "im109": self.im109,
            "equipment_photo": self.equipment_photo
        }


class Malfunction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200))
    knowledge = db.relationship(
        'Knowledge', backref='malfunction', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description
        }


class Solution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200))
    knowledge = db.relationship('Knowledge', backref='solution', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description
        }


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(80))
    knowledge = db.relationship('Knowledge', backref='category', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description
        }

    def serialize_options(self):
        return {
            "id": self.id,
            "value": self.description,
            "label": self.description
        }


class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    license_plate = db.Column(db.String(20))
    available = db.Column(db.Boolean, default=True, nullable=False)
    model = db.Column(db.String(50), nullable=True)
    maker = db.Column(db.String(50), nullable=True)
    vehicle_photo = db.Column(db.String, nullable=True)
    tickets = db.relationship('Ticket', backref='vehicle', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "license_plate": self.license_plate,
            "model": self.model,
            "maker": self.maker,
            "vehicle_photo": self.vehicle_photo,
            "value": self.id,
            "label": self.license_plate + " - " + self.maker + " " + self.model,
        }
