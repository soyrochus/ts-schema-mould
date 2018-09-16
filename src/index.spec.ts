/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */

import test from 'ava';
import "reflect-metadata";
import { IdType, Id, Schema, Controls, Field, Registry, Validations } from './index';

@Schema("basketball-player")
class BasketBallPlayer {

  @Id @Field()
  UUID: IdType | null = null;

  @Field(Controls.TextLine, [Validations.NotEmpty])
  name: string | null = null;

  @Field(Controls.RichTextArea)
  comments : string| null = null;

  @Field(Controls.Integer)
  jumps : number = 0;
 
  @Field(Controls.TextLine)
  imageUrl: string| null = null;
 }

test('Content-type is "basketball-player" defined by @ContentType', t => {

  const name = 'basketball-player';
  const bpMeta = Registry.Schemas[name];
  t.is(bpMeta.Id, name);
  t.is(bpMeta.Class, BasketBallPlayer);
  
  const bpInstance = new BasketBallPlayer();
  t.true(Reflect.hasOwnMetadata('content-type', bpInstance.constructor));
  t.is(Reflect.getOwnMetadata('content-type', bpInstance.constructor), bpMeta);

});

test('Content-type "basketball-player" has specified fields', t => {

  const name = 'basketball-player';
  const bpMeta = Registry.Schemas[name];
  
  t.is(bpMeta.UniqueIdField, 'UUID');
  t.is(bpMeta.Fields['UUID'].Id, 'UUID');
  t.is(bpMeta.Fields['UUID'].Control, Controls.None);
  t.deepEqual(bpMeta.Fields['UUID'].Validations, []);

  t.is(bpMeta.Fields['name'].Id, 'name');
  t.is(bpMeta.Fields['name'].Control, Controls.TextLine);
  t.deepEqual(bpMeta.Fields['name'].Validations[0], Validations.NotEmpty);

  t.is(bpMeta.Fields['comments'].Id, 'comments');
  t.is(bpMeta.Fields['comments'].Control, Controls.RichTextArea);
  t.deepEqual(bpMeta.Fields['comments'].Validations, []);

  t.is(bpMeta.Fields['jumps'].Id, 'jumps');
  t.is(bpMeta.Fields['jumps'].Control, Controls.Integer);
  t.deepEqual(bpMeta.Fields['jumps'].Validations, []);

  t.is(bpMeta.Fields['imageUrl'].Id, 'imageUrl');
  t.is(bpMeta.Fields['imageUrl'].Control, Controls.TextLine);
  t.deepEqual(bpMeta.Fields['imageUrl'].Validations, []);

});


/* 


@ContentType("basketball-player", ContentManager.Sequence)
class BasketballPlayer {

 @Id()
 id: ID;
 @Field(Controls.TextLin, Validations(Controls.NOT_EMPTY))
 name: string;
 @Field(Controls.RichText)
 comments: string;
 @Field(Controls.Integer)
 jumps : number;

 @Field(Controls.TextLine)
 imageUrl: string;
} 

*/