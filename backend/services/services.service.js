import * as repo from "../repositories/services.repo.js";

export async function listPublicServices() {
  const result = await repo.getActiveServices();
  return result.rows;
}

export async function listAdminServices(){
  const result = await repo.adminGetAllServices();
  return result.rows;
}

export async function deleteService(serviceId){
  await repo.adminDeleteService(serviceId);
}

export async function addService(name, price, duration){
  await repo.adminAddService(name, price, duration);
}

export async function listAllStaff(){
  const result = await repo.adminGetAllStaff();
  return result.rows;
}

export async function deleteStaff(staffId){
  const result = await repo.adminDeleteStaff(staffId);
}

export async function editService(serviceId, name, price, duration, isActive){
  await repo.adminEditService(serviceId, name, price, duration, isActive);
}