import { User, UserRole } from '@prisma/client';

export function canManageOrgSettings(user?: User | null) {
  return user ? [UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER].includes(user.role) : false;
}

export function canEditOpportunity(user?: User | null) {
  return user ? [UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.CONTRIBUTOR].includes(user.role) : false;
}

export function canViewOpportunity(user?: User | null) {
  return Boolean(user);
}

export function canManageBilling(user?: User | null) {
  return user ? [UserRole.OWNER, UserRole.ADMIN].includes(user.role) : false;
}
