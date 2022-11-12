export function deleteWithAllChildrenPath() {
    return '?/delete_with_all_children';
}

export function countChildrenPath(accountId: number) {
    return `/accounts/${accountId}/count_children`;
}

export function childAccount() {
    return `?/childaccount`;
}