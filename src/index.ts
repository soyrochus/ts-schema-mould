/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */
import {IdType, Registry as RegistryConstructor, Schema as MetaSchema, Field as MetaField, SelectField as MetaSelectField, MetaData, TypedMap, SchemaView} from './types';
import "reflect-metadata";

//Re-export
export {IdType, MetaData} from './types'; 

export const LIBRARY: {name: string, version: string} = {name: 'SchemaBuilder', version: '0.5.0'};

export enum Controls {None, TextLine, RichTextArea, Integer, Checkbox, Select, Date };

export enum Validations {NotEmpty};

export let Registry = new RegistryConstructor();

export const NO_VALIDATIONS = [];

export function getSchema(target: string | Function): MetaSchema  | null {

    let schema: MetaSchema | null;
    if (typeof target === 'string'){
        schema = Registry.Schemas[target];
    } else {
        schema = null;
        for (let n in Registry.Schemas) {
            let s = Registry.Schemas[n];
            if(s.Class === target){
                schema = s;
                break;
            }
        }
    }
    return schema;
}

export function Id(target: any, propertyKey: string){
    
    if (!Reflect.hasMetadata(MetaData.UniqueId, target)) {
        Reflect.defineMetadata(MetaData.UniqueId, propertyKey, target);
    } else {
        throw new Error(`${LIBRARY.name}: Duplicate Id on property '${propertyKey}'`);
    }
}

export function Schema(id: IdType, view?: SchemaView) {
/**
 *  Decorator Factory
 */
    return (_constructor: Function)=>{
        //console.log("ContentType:", _constructor);

        let target = _constructor.prototype;
        let fields : TypedMap<MetaField>;
        if (Reflect.hasOwnMetadata(MetaData.Fields, target)) {
            fields = Reflect.getOwnMetadata(MetaData.Fields, target);
        } else {
          fields = {};
        }
        
        let uniqueIdField: string;
        if (Reflect.hasMetadata(MetaData.UniqueId, target)) {
            uniqueIdField = Reflect.getOwnMetadata(MetaData.UniqueId, target);
        } else {
          uniqueIdField = 'id';
        }

        const ct = new MetaSchema(id, uniqueIdField, _constructor, fields, view);
        Registry.addSchema(id, ct);
        Reflect.defineMetadata(MetaData.Schema, ct, _constructor);
    };
}


export function Field(control: Controls = Controls.None, 
                      validations: Validations[] = [], inputSource: string | null = null) {
    /**
     *  Decorator Factory
     */
    return (target: any, propertyKey: string) => {
        //console.log(`Field target: ${target}, propertyKey: ${propertyKey}`, target);
       
        let fields: TypedMap<MetaField>;
        if (!Reflect.hasMetadata(MetaData.Fields, target)) {
          fields = {};
            Reflect.defineMetadata(MetaData.Fields, fields, target);
        } else {
            fields = Reflect.getMetadata(MetaData.Fields, target);
        }
        const f = new MetaSelectField(propertyKey, control, validations, inputSource);
        fields[propertyKey] = f;
    };  
}
