import * as adminService from "../services/admin.service.js";

export async function getAdminServices(req, res) {
  try {
    const services = await adminService.listAdminServices();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to load services" });
  }
}

export async function deleteService(req, res) {
  const serviceId = parseInt(req.params.id);
  try {
    await adminService.deleteService(serviceId);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to delete service" });
  }
}

export async function addService(req, res) {
  const { name, price, duration } = req.body;
  try {
    await adminService.addService(name, price, duration);
    res.status(201).json({ message: "Service added successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to add service" });
  }
}

export async function editService(req, res) {
  const serviceId = parseInt(req.params.id);
  const { name, price, duration, isActive } = req.body;
  try {
    await adminService.editService(serviceId, name, price, duration, isActive);
    res.json({ message: "Service updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to update service" });
  }
}

export async function getAllStaff(req, res) {
  try {
    const staff = await adminService.listAllStaff();
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to load staff" });
  }
}

export async function deleteStaff(req, res) {
  const staffId = parseInt(req.params.id);
  try {
    await adminService.deleteStaff(staffId);
    res.json({ message: "Staff member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to delete staff member" });
  }
}

export async function addStaff(req, res) {
  const { name, username, password, role } = req.body;
  try {
    const result = await adminService.addStaff(name, username, password, role);
    
    res.status(201).json({ message: "Staff member added successfully", staffId: result.rows[0].staff_id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to add staff member" });
  }
}

export async function addSchedule(req, res) {
  const staffId = parseInt(req.params.id);
  const scheduleArray = req.body.schedule;
  try {
    await adminService.addSchedule(staffId, scheduleArray);
    res.json({ message: "Schedule added successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to add schedule" });
  }
}

export async function updateStaff(req, res) {
  const staffId = parseInt(req.params.id);
  const { name, username, role, isActive, schedule } = req.body;
  try {
    await adminService.updateStaff(staffId, name, username, role, isActive);
    if (schedule && schedule.length > 0) {
      await adminService.updateStaffSchedule(staffId, schedule);
    }
    res.json({ message: "Staff member updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to update staff member" });
  }
}

export async function getStaffById(req, res) {
  const staffId = parseInt(req.params.id);
  try {
    const staff = await adminService.getStaffById(staffId);
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to load staff member" });
  }
}