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
  if (!price || isNaN(price) || price <= 0) {
    throw new Error("Please enter a valid positive price");
  }
  if (!duration || isNaN(duration) || duration <= 0) {
    throw new Error("Please enter a valid positive duration");
  }
  await adminRepo.adminAddService(name, price, duration);
}

export async function editService(serviceId, name, price, duration, isActive) {
  if (!name) {
    throw new Error("Please enter a service name");
  }
  if (!price || isNaN(price) || price <= 0) {
    throw new Error("Please enter a valid positive price");
  }
  if (!duration || isNaN(duration) || duration <= 0) {
    throw new Error("Please enter a valid positive duration");
  }
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

export async function addSchedule(staffId, scheduleArray) {
  for (const schedule of scheduleArray) {
    const { dayOfWeek, startTime, endTime } = schedule;
    await adminRepo.addSchedule(staffId, dayOfWeek, startTime, endTime);
  }
}

export async function updateStaff(staffId, name, username, role){
  if (!name) {
    throw new Error("Please enter a staff name");
  }
  if (!username) {
    throw new Error("Please enter a username");
  }
  if (!role){
    throw new Error("Please select a role");
  }
  await adminRepo.updateStaff(staffId, name, username, role);
}

export async function getStaffById(staffId){
  const staffResult = await adminRepo.getStaffById(staffId);
  const scheduleResult = await adminRepo.getStaffSchedule(staffId);
  
  if (staffResult.rows.length === 0) {
    throw new Error("Staff member not found");
  }
  
  return {
    staff_name: staffResult.rows[0].staff_name,
    staff_username: staffResult.rows[0].staff_username,
    staff_role: staffResult.rows[0].staff_role,
    schedule: scheduleResult.rows
  };
}

export async function updateStaffSchedule(staffId, scheduleArray){
  await adminRepo.deleteStaffSchedule(staffId);
  for (const schedule of scheduleArray) {
    const { dayOfWeek, startTime, endTime } = schedule;
    await adminRepo.addSchedule(staffId, dayOfWeek, startTime, endTime);
  }
}