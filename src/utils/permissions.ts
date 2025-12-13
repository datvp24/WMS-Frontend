export function hasPermission(
    requirePerm: string,
    userPerms: string[]
): boolean {
    if (!userPerms) return false;
    return userPerms.includes(requirePerm);
}
export function hasAnyPermission(
    required: string[],
    userPerms: string[]
): boolean {
    return required.some(p => userPerms.includes(p));
}
export function hasAllPermissions(
    required: string[],
    userPerms: string[]
): boolean {
    return required.every(p => userPerms.includes(p));
}
