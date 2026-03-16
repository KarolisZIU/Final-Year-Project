import * as adminRepo from "../repositories/admin.repo.js";
import bcrypt from "bcrypt";

export async function listAdminServices() {
  const result = await adminRepo.adminGetAllServices();
  return result.rows;
}

export async function deleteService(serviceId) {
  await adminRepo.adminDeleteService(serviceId);
}

export async function addService(name, price, duration) {
  if (!name) {
    throw new Error("Please enter a service name");
  }
  if (!price || isNaN(price)) {
    throw new Error("Please enter a valid price");
  }
  if (!duration || isNaN(duration)) {
    throw new Error("Please enter a valid duration");
  }
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
  const staffResult = await adminRepo.getStaffById(staffId);
  const staff = staffResult.rows[0];
  if (staff.staff_role === "admin") {
    const adminCountResult = await adminRepo.countAdmins();
    const adminCount = parseInt(adminCountResult.rows[0].count);
    if (adminCount <= 1) {
      throw new Error("Cannot delete the last admin. There must be at least one admin.");
    }
  }
  await adminRepo.adminDeleteStaff(staffId);
}

export async function addStaff(name, username, password, role) {
  if (!name) {
    throw new Error("Please enter a staff name");
  }
  if (!username) {
    throw new Error("Please enter a username");
  }
  if (!password) {
    throw new Error("Please enter a password");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  return await adminRepo.addStaff(name, username, hashedPassword, role);
}
