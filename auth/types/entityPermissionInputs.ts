export const entityPermissionInputLabels = {
    readWriteEntities: 'Read Write Entities',
    restrictedReadWriteEntities: 'Restricted Read Write Entities',
    readonlyEntities: 'Readonly Entities',
    restrictedReadonlyEntities: 'Restricted Readonly Entities',
};

export const getEntityPermissionInputs =() => [
    {field: 'readWriteEntities', header: entityPermissionInputLabels.readWriteEntities},
    {field: 'restrictedReadWriteEntities', header: entityPermissionInputLabels.restrictedReadWriteEntities},
    {field: 'readonlyEntities', header: entityPermissionInputLabels.readonlyEntities },
    {field: 'restrictedReadonlyEntities', header: entityPermissionInputLabels.restrictedReadonlyEntities},
];