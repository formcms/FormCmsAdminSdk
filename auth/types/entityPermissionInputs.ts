export type EntityPermissionLabels = {
    readWriteEntities:string;
    restrictedReadWriteEntities:string;
    readonlyEntities:string;
    restrictedReadonlyEntities:string;
}

export const defaultEntityPermissionLabels:EntityPermissionLabels = {
    readWriteEntities: 'Read Write Entities',
    restrictedReadWriteEntities: 'Restricted Read Write Entities',
    readonlyEntities: 'Readonly Entities',
    restrictedReadonlyEntities: 'Restricted Readonly Entities',
};

export const getEntityPermissionInputs =(labels:EntityPermissionLabels = defaultEntityPermissionLabels) => [
    {field: 'readWriteEntities', header: labels.readWriteEntities},
    {field: 'restrictedReadWriteEntities', header: labels.restrictedReadWriteEntities},
    {field: 'readonlyEntities', header: labels.readonlyEntities },
    {field: 'restrictedReadonlyEntities', header: labels.restrictedReadonlyEntities},
];