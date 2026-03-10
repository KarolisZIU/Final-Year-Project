import * as repo from "../repositories/services.repo.js";

export async function listPublicServices() {
  const result = await repo.getActiveServices();
  return result.rows;
}