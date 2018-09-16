/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */

import {LIBRARY, Controls, Validations} from './index';

export type ID = string;

export interface TypedMap<T> {
    [k: string]: T
}

export class Schema {

    constructor(private id: ID, private _constructor: Function, private fields: TypedMap<Field>){}

    public get Id(){
        return this.id;
    }

    public get Class(){
        return this._constructor;
    }

    public get Fields(){
        return this.fields;
    }
}

export class Field {

    constructor(private id: ID, private control: Controls, private validatons: Validations[]){}

    public get Id(){
        return this.id;
    }

    public get Control(){
        return this.control;
    }

    public get Validations(){
        return this.validatons;
    }

}

export class ContentItem {

    constructor(public id: ID){}
}

export class SchemaRegistry{

    private _schemas: TypedMap<Schema> = {}

    get Schemas() { return this._schemas};

    addSchema(id: ID, ct: Schema): void{
        if (this._schemas[id]){

            throw new Error(`${LIBRARY.name}: ContentType '${id}' already defined.`);
        }
        
        this._schemas[id] = ct;
    }
}