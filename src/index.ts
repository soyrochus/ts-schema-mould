/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */
import {
    IdType, Registry,
    Schema as MetaSchema,
    Field as MetaField,
    CompoundSchema as MetaCompoundSchema,
    SelectField as MetaSelectField,
    MetaData,
    TypedMap,
    SchemaView
} from './types';
import "reflect-metadata";

//Re-export
export { IdType, MetaData, Registry } from './types';

export const LIBRARY: { name: string, version: string } = { name: 'SchemaBuilder', version: '0.5.0' };

export enum Controls { None, TextLine, RichTextArea, Integer, Checkbox, Select, Date };

export enum Validations { NotEmpty };

export const NO_VALIDATIONS = [];

export function getSchema(target: string | Function): MetaSchema | null {

    let schema: MetaSchema | null;
    if (typeof target === 'string') {
        schema = Registry.Schemas[target];
    } else {
        schema = null;
        for (let n in Registry.Schemas) {
            let s = Registry.Schemas[n];
            if (s.Class === target) {
                schema = s;
                break;
            }
        }
    }
    return schema;
}

export function getCompoundSchema(target: string | Function): MetaCompoundSchema | null {

    let schema: MetaCompoundSchema | null;
    if (typeof target === 'string') {
        schema = Registry.CompoundSchemas[target];
    } else {
        schema = null;
        for (let n in Registry.CompoundSchemas) {
            let s = Registry.CompoundSchemas[n];
            if (s.Class === target) {
                schema = s;
                break;
            }
        }
    }
    return schema;
}

export function Id(target: any, propertyKey: string) {

    if (!Reflect.hasMetadata(MetaData.UniqueId, target)) {
        Reflect.defineMetadata(MetaData.UniqueId, propertyKey, target);
    } else {
        throw new Error(`${LIBRARY.name}: Duplicate Id on property '${propertyKey}'`);
    }
}

export function Schema(id?: IdType, view?: SchemaView) {
    /**
     *  Decorator Factory
     */
    return (_constructor: Function) => {
        //console.log("ContentType:", _constructor);

        let target = _constructor.prototype;
        let _id: string;
        if(typeof(id) === 'undefined'){
            _id = _constructor.name;
        } else {
            _id = id; 
        }
        let fields: TypedMap<MetaField>;
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

        const ct = new MetaSchema(_id, uniqueIdField, _constructor, fields, view);
        Registry.addSchema(_id, ct);
        Reflect.defineMetadata(MetaData.Schema, ct, _constructor);
    };
}

export function CompoundSchema(id?: IdType) {

    return (_constructor: Function) => {
        //console.log("ContentType:", _constructor);

        let target = _constructor.prototype;
        let _id: string;
        if(typeof(id) === 'undefined'){
            _id = _constructor.name;
        } else {
            _id = id; 
        }
        let fields: TypedMap<string | Function>;
        if (Reflect.hasOwnMetadata(MetaData.EmbeddedSchemas, target)) {
            fields = Reflect.getOwnMetadata(MetaData.EmbeddedSchemas, target);
        } else {
            fields = {};
        }

        let uniqueIdField: string;
        if (Reflect.hasMetadata(MetaData.UniqueId, target)) {
            uniqueIdField = Reflect.getOwnMetadata(MetaData.UniqueId, target);
        } else {
            uniqueIdField = 'id';
        }

        const ct = new MetaCompoundSchema(_id, uniqueIdField, _constructor, fields);
        Registry.addCompoundSchema(_id, ct);
        Reflect.defineMetadata(MetaData.CompoundSchema, ct, _constructor);
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

export function EmbeddedSchema(id: string | Function) {
    /**
     *  Decorator Factory
     */
    return (target: any, propertyKey: string) => {
       
       
        let schemas: TypedMap<string | Function>;

        if (!Reflect.hasMetadata(MetaData.EmbeddedSchemas, target)) {
            schemas = {};
            Reflect.defineMetadata(MetaData.EmbeddedSchemas, schemas, target);
        } else {
            schemas = Reflect.getMetadata(MetaData.EmbeddedSchemas, target);
        }

        schemas[propertyKey] = id;
    };
}