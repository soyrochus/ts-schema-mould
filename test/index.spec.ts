// tslint:disable:no-expression-statement

import test from 'ava';
import "reflect-metadata";
import { ContentType, Registry } from '../src/index';

@ContentType("basketball-player")
class BasketBallPlayer {


}

test('Content-type is "basketball-player" defined by @ContentType', t => {

  const name = 'basketball-player';
  const bpMeta = Registry.ContentTypes[name];
  t.is(bpMeta.Id, name);

  const bpInstance = new BasketBallPlayer();
  t.true(Reflect.hasOwnMetadata('content-type', bpMeta));
  
  t.is(Reflect.getOwnMetadata('content-type', bpInstance), bpMeta);

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