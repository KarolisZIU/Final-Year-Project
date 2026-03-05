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