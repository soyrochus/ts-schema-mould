/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */
import {IdType, SchemaRegistry, Schema as MetaSchema, Field as MetaField, TypedMap} from './types';
import "reflect-metadata";

//Re-export
export {IdType} from './types'; 

export const LIBRARY: {name: string, version: string} = {name: 'SchemaBuilder', version: '0.0.1'};

export enum Controls {None, TextLine, RichTextArea, Integer, checkbox};

export enum Validations {NotEmpty};

export let Registry = new SchemaRegistry();


export function Id(target: any, propertyKey: string){
    
    if (!Reflect.hasMetadata('uniqueId', target)){
      
        Reflect.defineMetadata('uniqueId', propertyKey, target);
    } else {
        throw new Error(`${LIBRARY.name}: Duplicate Id on propery '${propertyKey}'`);
    }
}

export function Schema(id: IdType) {
/**
 *  Decorator Factory
 */
    return (_constructor: Function)=>{
        //console.log("ContentType:", _constructor);

        let target = _constructor.prototype;
        let fields : TypedMap<MetaField>;
        if (Reflect.hasOwnMetadata('fields', target)){
            fields = Reflect.getOwnMetadata('fields', target);
        } else{
            fields = {};
        }
        
        let uniqueIdField: string;
        if (Reflect.hasMetadata('uniqueId', target)){
      
            uniqueIdField = Reflect.getOwnMetadata('uniqueId', target);
        } else {
            uniqueIdField = 'id';
        }

        const ct = new MetaSchema(id, uniqueIdField, _constructor, fields);
        Registry.addSchema(id, ct);
        Reflect.defineMetadata('content-type', ct, _constructor);
    };
}


export function Field(control: Controls = Controls.None, 
                      validations: Validations[] = []) {
    /**
     *  Decorator Factory
     */
    return (target: any, propertyKey: string) => {
        //console.log(`Field target: ${target}, propertyKey: ${propertyKey}`, target);
       
        let fields: TypedMap<MetaField>;
        if (!Reflect.hasMetadata('fields', target)){
            fields = {};
            Reflect.defineMetadata('fields', fields, target);
        } else {
            fields = Reflect.getMetadata('fields', target);
        }
        const f = new MetaField(propertyKey, control, validations);
        fields[propertyKey] = f;
    };  
}


/*
export function Param(target: Object, propertyKey: string | symbol, parameterIndex: number) {

    console.log(target);
    console.log(propertyKey);
    console.log(parameterIndex);
}

@ContentType("our-services")
class Target {

    constructor(value: number){ this.prop = value;}

    @Field public prop: number;

    doIt(times: number): void{
        
        console.log(this.prop);
        console.log(times * this.prop);
        console.log((this.constructor as AnyProp)._schema_builder.name);
    }
}

*/
