import * as adminRepo from "../repositories/admin.repo.js";

export async function listAdminServices() {
  const result = await adminRepo.adminGetAllServices();
  return result.rows;
}

export async function deleteService(serviceId) {
  await adminRepo.adminDeleteService(serviceId);
}

export async function addService(name, price, duration) {
  await adminRepo.adminAddService(name, price, duration);
}

export async function editService(serviceId, name, price, duration, isActive) {
  await adminRepo.adminEditService(serviceId, name, price, duration, isActive);
}

export async function listAllStaff() {
  const result = await adminRepo.adminGetAllStaff();
  return result.rows;
}

export async function deleteStaff(staffId) {
  await adminRepo.adminDeleteStaff(staffId);
}
