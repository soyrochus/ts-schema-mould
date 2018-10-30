/* tslint:disable */
/* This as meta-programming break all sensible rules
   if not disabled in the whole file, it would have to 
   be filles with tslint:disable* directives */

import test from 'ava';
import "reflect-metadata";
import { IdType, Id, Schema, CompoundSchema, EmbeddedSchema, Controls, Field, getSchema, getCompoundSchema, MetaData, Validations, NO_VALIDATIONS } from './index';
import { SelectField, SchemaView, isLayoutSegment, LayoutSegment, Field as MetaField, FieldDef } from './types';


let basketballview: SchemaView = {

  title: "Basketball player data",
  layout: [{
    title: 'Player',
    rows: [[{ field: 'name', props: { width: 200, icon: 'mandatory' } }, { field: 'jumps' }]]
  }, {
    title: 'General',
    rows: [[{ field: 'comments', props: { width: 200 } }, { field: 'imageUrl' }],
    [{ field: 'team' }, { field: 'date' }]]
  }]
};

let teamview: SchemaView = {
  title: "Basketball player data",
  layout: [{ field: 'name' }, { field: 'rank' }]
};

@Schema('no-field-no-view')
class NoFieldNoView {

}

@Schema('basketball-team', teamview)
class BasketballTeam {
  @Id @Field()
  UUID: IdType | null = null;

  @Field(Controls.TextLine, [Validations.NotEmpty])
  name: string | null = null;

  @Field(Controls.Integer)
  rank: number = 0;
}

@Schema("basketball-player", basketballview)
class BasketBallPlayer {

  @Id @Field()
  UUID: IdType | null = null;

  @Field(Controls.TextLine, [Validations.NotEmpty])
  name: string | null = null;

  @Field(Controls.RichTextArea)
  comments: string | null = null;

  @Field(Controls.Integer)
  jumps: number = 0;

  @Field(Controls.TextLine)
  imageUrl: string | null = null;

  @Field(Controls.Select, NO_VALIDATIONS, "Teams")
  team: string | null = null;

  @Field(Controls.Date)
  date: string | null = null;
}

@CompoundSchema('basketball-player-team')
class BasketBallPlayerTeam {

  constructor() {
    this.player = new BasketBallPlayer();
    this.team = new BasketballTeam();
  }

  @EmbeddedSchema("basketball-player")
  public player: BasketBallPlayer;
  @EmbeddedSchema("basketball-team")
  public team: BasketballTeam;

}

test('Schema is "basketball-player" defined by @ContentType', t => {

  const name = 'basketball-player';

  //const bpMeta = Registry.Schemas[name];
  const bpMeta = getSchema(name);
  const bpMeta2 = getSchema(BasketBallPlayer);
  t.is(bpMeta, bpMeta2);

  if (bpMeta) {
    t.is(bpMeta.Id, name);
    t.is(bpMeta.Class, BasketBallPlayer);
  } else {
    t.fail('Schema cannot be null');
  }

  const bpInstance = new BasketBallPlayer();
  t.true(Reflect.hasOwnMetadata(MetaData.Schema, bpInstance.constructor));
  t.is(Reflect.getOwnMetadata(MetaData.Schema, bpInstance.constructor), bpMeta);

});

test('Content-type "basketball-player" has specified fields', t => {

  const name = 'basketball-player';
  //const bpMeta = Registry.Schemas[name];
  const bpMeta = getSchema(name);
  if (bpMeta) {
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

    t.is(bpMeta.Fields['team'].Id, 'team');
    t.is(bpMeta.Fields['team'].Control, Controls.Select);
    t.deepEqual(bpMeta.Fields['team'].Validations, []);
    t.deepEqual((bpMeta.Fields['team'] as SelectField).InputSource, 'Teams');

    t.is(bpMeta.Fields['date'].Id, 'date');
    t.is(bpMeta.Fields['date'].Control, Controls.Date);


  } else {

    t.fail('Schema cannot be null');
  }

});

test('"basketball" is View of Basketball Player', t => {

  const name = 'basketball-player';

  const bpMeta = getSchema(name);
  const bpMeta2 = getSchema(BasketBallPlayer);
  t.is(bpMeta, bpMeta2);

  if (bpMeta) {

    //t.deepEqual(basketballview(), bpMeta.View);
    if (bpMeta.View && bpMeta.View.layout.length > 0) {
      if (isLayoutSegment(bpMeta.View.layout[0])) {
        let layout0 = bpMeta.View.layout[0] as LayoutSegment;

        let field1 = (layout0.rows[0][0].field as MetaField);
        let props1 = layout0.rows[0][0].props || {};
        t.is(field1.Id, 'name');
        t.is(field1.Control, Controls.TextLine);
        t.is(props1.icon, 'mandatory');

        let layout1 = bpMeta.View.layout[1] as LayoutSegment;
        let field2 = (layout1.rows[0][1].field as MetaField);
        t.is(field2.Id, 'imageUrl');

        let field3 = (layout1.rows[1][1].field as MetaField);
        t.is(field3.Id, 'date');
      }
    } else {
      t.fail(`Schema ${name} has invalid view`);
    }

  } else {

    t.fail('Schema cannot be null');
  }
});

test('"teamview" is View of Basketball Team', t => {

  const name = 'basketball-team';

  const bpMeta = getSchema(name);
  const bpMeta2 = getSchema(BasketballTeam);
  t.is(bpMeta, bpMeta2);

  if (bpMeta) {

    //t.deepEqual(basketballview(), bpMeta.View);
    if (bpMeta.View && bpMeta.View.layout.length > 0) {
      if (!isLayoutSegment(bpMeta.View.layout[0])) {
        let fielddef0 = (bpMeta.View.layout[0] as FieldDef);
        let field0 = fielddef0.field as MetaField;
        t.is(field0.Id, 'name');

        let fielddef1 = (bpMeta.View.layout[1] as FieldDef);
        let field1 = fielddef1.field as MetaField;
        t.is(field1.Id, 'rank');
        t.is(field1.Control, Controls.Integer);
      }
    } else {
      t.fail(`Schema ${name} has invalid view`);
    }

  } else {

    t.fail('Schema cannot be null');
  }

});


test('"NoFieldNoView" has no Fields nor View', t => {

  const name = 'no-field-no-view';

  const bpMeta = getSchema(name);
  const bpMeta2 = getSchema(NoFieldNoView);
  t.is(bpMeta, bpMeta2);

  if (bpMeta) {

    t.is(Object.keys(bpMeta.Fields).length, 0);
    t.falsy(bpMeta.View);

  } else {

    t.fail('Schema cannot be null');
  }
});


test('"BasketBallPlayerTeam" is a CompoundSchema', t => {

  const name = 'basketball-player-team';

  const bpMeta = getCompoundSchema(name);
  const bpMeta2 = getCompoundSchema(BasketBallPlayerTeam);

  t.is(bpMeta, bpMeta2);

  const playername = 'basketball-player';
  const playerproperty = 'player';
  if (bpMeta) {

    const bpMeta3 = getSchema(playername);
    const bpMeta4 = bpMeta.EmbeddedSchemas[playerproperty];

    t.is(bpMeta3, bpMeta4);

  } else {
    t.fail('CompoundSchema cannot be null');
  }
});
