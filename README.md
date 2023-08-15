# Final Project
# CBL Desk - Customer Support Ticket System
By employing this ticket system and compiling information regarding equipment history, manufacturers will be enabled to offer more effective and optimized support for customer equipment. This is achieved by analysing intervention histories performed on identical or similar types of equipment, leading to more precise and rapid prediction of solutions required to address issues.

##Technologies
### Front-end
- React
### Back-end
- Flask + SQLAlchemy
## Functionalities

### 1) Users
Four default user types are available: Admin, Engineer, Technician, Customer.

### 2) Tickets
Distinct ticket statuses correspond to each stage:
- New (when a customer initiates a new ticket)
- Opened (when an admin assigns a technician/engineer to the ticket)
- In Progress (when a technician/engineer commences assistance)
- Resolved (when a technician/engineer concludes assistance)
- Closed (when an admin finalizes the resolved ticket)

### 3) Knowledge base
A database stores data gathered from assistance sessions, utilized for statistical analysis to enhance manufacturer insights into product/equipment production and optimize assistance by offering equipment repair know-how.

### 4) API's
- Google Maps API: Provides routes, distance, and travel time for technician/engineer assistance reports.
- Cloudinary API: Facilitates storage of photos uploaded by customers during ticket creation, as well as equipment and vehicle images.

### 5) Technologies
1. React
2. Bootstrap
3. Flask

## Main flow
1) Customer initiates a ticket
2) Admin assigns vehicle and technician/engineer
3) Technician/engineer opens ticket and initiates assistance
4) Technician/engineer compiles a report detailing encountered malfunctions and implemented solutions
5) Technician/engineer closes the report
6) Customer approves the report using authentication credentials
7) Technician/engineer completes assistance
8) Admin finalizes the ticket

## Future features
1. UI/UX enhancements
2. Data analysis for equipment-related statistical insights to aid manufacturers in identifying areas for improvement
3. Integration of Websockets for real-time data updates
4. Integration of Notifications API for user notifications at various ticket stages4. Notifications API integration for ticket stage user notification
