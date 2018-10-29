/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */

import {LIBRARY, Controls, Validations} from './index';

export type IdType = string;

export enum MetaData {
  Schema = 'schema',
  Fields = 'fields',
  UniqueId = 'uniqueId'
}

export interface SimpleProps {
    [name: string]: number | boolean | string;
}
  
export interface SchemaView {
    title: string;   
    layout: FieldDef[] | LayoutDef;
}
export type LayoutDef = LayoutSegment[];

export interface FieldDef {
    field: string | Field;
    props?: SimpleProps;
}
export interface LayoutSegment {
  
    title: string;
    rows: Array<FieldDef[]>;
}

export interface TypedMap<T> {
    [k: string]: T;   
}

export function isLayoutSegment(target:  FieldDef | LayoutSegment): target is LayoutSegment {
    return (<LayoutSegment>target).title !== undefined;
 }


export class Schema {

    constructor(private id: IdType,  
         private uniqueIdField: string,
         private _constructor: Function, 
         private fields: TypedMap<Field>, 
         private view: SchemaView | null= null){
            
            if (!this.view){
                return;
            } else if((this.view.title.length == 0) || (this.view.layout.length == 0)){
                throw new Error(`${LIBRARY.name}: Schema '${id}' has invalid view (no title or layout.lenght == 0).`); 
            } else if (isLayoutSegment(this.view.layout[0])){
                for(let segment of this.view.layout as LayoutSegment[]){
                    for(let row of segment.rows){
                        for(let fdef of row){
                            this.setFieldOnDef(fdef);
                        }
                    }
                }
            } else {
                for(let fdef of this.view.layout as FieldDef[]){
                    this.setFieldOnDef(fdef);
                }
            }
         }

    private setFieldOnDef(def: FieldDef){
        if (typeof(def.field) === 'string'){
            let fieldType: Field | undefined = this.fields[def.field];
            if (fieldType === undefined){
                throw new Error(`${LIBRARY.name}: Schema '${this.id}' has invalid Field defined in View (${def.field})`);
            } else {
                def.field = fieldType;
            }
        }
    }

    public get Id(){
        return this.id;
    }

    public get UniqueIdField(){
        return this.uniqueIdField;
    }

    public get Class(){
        return this._constructor;
    }

    public get Fields(){
        return this.fields;
    }

    public get View(){
        return this.view
    }
    
}

export class Field {
  
    constructor(private id: IdType, private control: Controls, private validations: Validations[]){}

    public get Id(){
        return this.id;
    }

    public get Control(){
        return this.control;
    }

    public get Validations(){
        return this.validations;
    }

}

export class SelectField extends Field {

    constructor( id: IdType,  control: Controls,  validations: Validations[], private inputSource: string | null){
        super(id, control, validations);
    }

    public get InputSource(){
        return this.inputSource;
    }
}

export class ContentItem {

    constructor(public id: IdType){}
}

export class Registry{

    private _schemas: TypedMap<Schema> = {};

    get Schemas() { return this._schemas};

    addSchema(id: IdType, ct: Schema): void{
        if (this._schemas[id]){

            throw new Error(`${LIBRARY.name}: Schema '${id}' already defined.`);
        }
        
        this._schemas[id] = ct;
    }
}