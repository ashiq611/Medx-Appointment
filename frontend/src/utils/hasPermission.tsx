import { RoleNamesEnum } from "@/app/constant/formFeilds"

export const hasPermission = (role: string): boolean => {
//   just rerturn true if role is equal to admin
  if (role === RoleNamesEnum.ADMIN) {
    return true;
  }
  return false;
}