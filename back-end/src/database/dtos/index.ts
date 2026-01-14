export type DefaultValues = Array<string | number | string[]>;

export type DefaultInsertDTO = {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
    changedRows: number;
};
