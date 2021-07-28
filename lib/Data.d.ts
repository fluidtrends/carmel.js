import { Session } from '.';
export declare class Data {
    private _content;
    private _session;
    constructor(session: Session);
    get session(): Session;
    get content(): any;
    save(): string;
    load(c: string): void;
    add(table: string, row: any, message: string): any;
    updateEntry(table: string, id: string, message: string, update: any): void;
    remove(table: string, id: string): void;
    update(section: string, data: any, message: string): void;
    toJSON(): any;
}
