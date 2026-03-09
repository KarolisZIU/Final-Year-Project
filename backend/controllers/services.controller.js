import * as servicesService from "../services/services.service.js";

export async function getPublicServices(req, res) {
  try {
    const services = await servicesService.listPublicServices();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load services" });
  }
}

export async function getAdminServices(req, res) {
  try {
    const services = await servicesService.listAdminServices();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load services" });
  }
}

export async function deleteService(req, res) {
  const serviceId = parseInt(req.params.id);
  try {
    await servicesService.deleteService(serviceId);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete service" });
  }
}

export async function addService(req, res) {
  const { name, price, duration } = req.body;
  try {
    await servicesService.addService(name, price, duration);
    res.json({ message: "Service added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add service" });
  }
}

export async function getAllStaff(req, res) {
  try {
    const staff = await servicesService.listAllStaff();
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load staff" });
  }
}

export async function deleteStaff(req, res) {
  const staffId = parseInt(req.params.id);
  try {
    await servicesService.deleteStaff(staffId);
    res.json({ message: "Staff member deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.message === "Cannot delete the last admin") {
      res.status(400).json({ error: "Cannot delete the last admin. There must be at least one admin." });
    } else {
      res.status(500).json({ error: "Failed to delete staff member" });
    }
  }
}

export async function editService(req, res) {
  const serviceId = parseInt(req.params.id);
  const { name, price, duration, isActive } = req.body;
  try {
    await servicesService.editService(serviceId, name, price, duration, isActive);
    res.json({ message: "Service updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update service" });
  }
}