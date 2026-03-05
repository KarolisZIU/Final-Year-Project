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