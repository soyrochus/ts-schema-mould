/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */

import {LIBRARY} from './index';

export type ID = string;

export type AnyProp = {[k: string]: any};

export enum Controls {TextLine, RichTextArea, Integer, checkbox};

export enum Validations {NotEmpty};

export class ContentType {


    constructor(private id: ID){}

    public get Id(){
        return this.id;
    }
}


export class Schema {

    constructor(public id: ID){}
}

export class Field {

    constructor(public id: ID){}
}

export class ContentItem {

    constructor(public id: ID){}
}

export class SchemaRegistry{

    private _contenTypes: {[k: string]: ContentType}={}

    get ContentTypes() { return this._contenTypes};

    addContentType(id: ID, ct: ContentType): void{
        if (this._contenTypes[id]){

            throw new Error(`${LIBRARY.name}: ContentType '${id}' already defined.`);
        }
        
        this._contenTypes[id] = ct;
    }
}