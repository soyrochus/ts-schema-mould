/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */
import {/*ID, Validatons, Controls, */ AnyProp, SchemaRegistry} from './types';

export const LIBRARY: {name: string, version: string} = {name: 'SchemaBuilder', version: '0.0.1'};

export function ContentType(signature: string) {

    return (_constructor: Function)=>{
        console.log("ContentType:", _constructor);
        (_constructor as AnyProp)._schema_builder = {name : signature};
    };
}

//function Field(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>){
export function Field(target: any, propertyKey: string){
    console.log("Field:", target);
    console.log(propertyKey);
    target._schema_builder = {fields:[]};
    target._schema_builder.fields.push(propertyKey);
    //console.log(descriptor);
}

export function Param(target: Object, propertyKey: string | symbol, parameterIndex: number) {

    console.log(target);
    console.log(propertyKey);
    console.log(parameterIndex);
}


export let Registry = new SchemaRegistry();

/*@ContentType("our-services")
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
