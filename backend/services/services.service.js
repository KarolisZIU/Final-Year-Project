import * as servicesRepo from "../repositories/services.repo.js";
import * as staffRepo from "../repositories/staff.repo.js";

export async function listPublicServices() {
  const result = await servicesRepo.getActiveServices();
  return result.rows;
}

export async function listAllStaff() {
  const result = await staffRepo.getAllStaff();
  return result.rows;
}