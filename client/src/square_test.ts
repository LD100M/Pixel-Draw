import * as assert from 'assert';
import { solid, split, toJson, fromJson, findRoot, replaceRoot, Square} from './square';
import { cons, nil } from './list';


describe('square', function() {

  it('toJson', function() {
    assert.deepStrictEqual(toJson(solid("white")), "white");
    assert.deepStrictEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepStrictEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepStrictEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepStrictEqual(fromJson("white"), solid("white"));
    assert.deepStrictEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepStrictEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepStrictEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

  it('findRoot', function() {
    const s1: Square = split(solid("red"), solid("green"), solid("white"), solid("yellow"));
    const s2: Square = split(solid("green"), solid("purple"), solid("white"), solid("blue")); 
    const s3: Square = split(solid("green"), solid("blue"), solid("purple"), solid("blue"));
    const s4: Square = split(split(solid("red"), solid("green"), solid("white"), solid("yellow")), split(solid("green"), solid("purple"), solid("white"), solid("blue")), split(solid("green"), solid("blue"), solid("purple"), solid("blue")), split(solid("green"), solid("blue"), solid("yellow"), solid("white")));
    
    // 0-1-many hueristic, error case(square is solid) 2 tests
    assert.throws(() => findRoot(cons("NW", nil), solid("red")), Error);
    assert.throws(() => findRoot(cons("SW", cons("NE",nil)), solid("white")), Error);

    // 0-1-many hueristic, 0 recursive call case (2 cases) 
    assert.deepStrictEqual(findRoot(nil, s1), s1); 
    assert.deepStrictEqual(findRoot(nil, s2), s2); 

    // 0-1-many hueristic, 1 recursive call case (8 cases)
    assert.deepStrictEqual(findRoot(cons("NW", nil), s1), solid("red")); 
    assert.deepStrictEqual(findRoot(cons("NW", nil), s2), solid("green")); 

    assert.deepStrictEqual(findRoot(cons("NE", nil), s1), solid("green")); 
    assert.deepStrictEqual(findRoot(cons("NE", nil), s2), solid("purple"));
    
    assert.deepStrictEqual(findRoot(cons("SW", nil), s1), solid("white")); 
    assert.deepStrictEqual(findRoot(cons("SW", nil), s3), solid("purple")); 

    assert.deepStrictEqual(findRoot(cons("SE", nil), s1), solid("yellow")); 
    assert.deepStrictEqual(findRoot(cons("SE", nil), s3), solid("blue")); 

    // 0-1-many hueristic, many recursive call case (8 cases)
    assert.deepStrictEqual(findRoot(cons("NW", cons("NE", nil)), s4), solid("green"));
    assert.deepStrictEqual(findRoot(cons("NW", cons("NW", nil)), s4), solid("red"));

    assert.deepStrictEqual(findRoot(cons("NW", cons("NE", nil)), s4), solid("green"));
    assert.deepStrictEqual(findRoot(cons("NW", cons("NW", nil)), s4), solid("red"));

    assert.deepStrictEqual(findRoot(cons("SW", cons("SE", nil)), s4), solid("blue"));
    assert.deepStrictEqual(findRoot(cons("SW", cons("SW", nil)), s4), solid("purple"));

    assert.deepStrictEqual(findRoot(cons("NE", cons("NE", nil)), s4), solid("purple"));
    assert.deepStrictEqual(findRoot(cons("SW", cons("NW", nil)), s4), solid("green"));
  });

  it('replaceRoot', function() {
    const s5: Square = split(solid("yellow"), solid("red"), solid("white"), solid("yellow"));
    const s6: Square = split(solid("orange"), solid("purple"), solid("yellow"), solid("blue")); 
    const s7: Square = split(solid("green"), solid("yellow"), solid("orange"), solid("blue"));
    const s8: Square = split(split(solid("yellow"), solid("red"), solid("white"), solid("purple")), split(solid("yellow"), solid("red"), solid("green"), solid("blue")), split(solid("green"), solid("red"), solid("blue"), solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))); 

    // 0-1-many hueristic, Error cases (2 cases) 
    assert.throws(() => replaceRoot(cons("NE", nil), solid("red"), s5), Error)
    assert.throws(() => replaceRoot(cons("NW", nil), solid("green"), s8), Error)

    // 0-1-many hueristic, 0 recursive call case (2 cases) 
    assert.deepStrictEqual(replaceRoot(nil, s5, s6), s6); 
    assert.deepStrictEqual(replaceRoot(nil, s7, s8), s8);

    // 0-1-many hueristic, 1 recursive call case (8 cases)
    assert.deepStrictEqual(replaceRoot(cons("NW", nil), s5, s6), split(s6, solid("red"), solid("white"), solid("yellow")));
    assert.deepStrictEqual(replaceRoot(cons("NW", nil), s6, s7), split(s7, solid("purple"), solid("yellow"), solid("blue")));

    assert.deepStrictEqual(replaceRoot(cons("NE", nil), s5, s6), split(solid("yellow"), s6, solid("white"), solid("yellow")));
    assert.deepStrictEqual(replaceRoot(cons("NE", nil), s6, s7), split(solid("orange"), s7, solid("yellow"), solid("blue")));

    assert.deepStrictEqual(replaceRoot(cons("SW", nil), s5, s6), split(solid("yellow"), solid("red"), s6, solid("yellow")));
    assert.deepStrictEqual(replaceRoot(cons("SW", nil), s6, s7), split(solid("orange"), solid("purple"), s7, solid("blue")));

    assert.deepStrictEqual(replaceRoot(cons("SE", nil), s5, s6), split(solid("yellow"), solid("red"), solid("white"), s6));
    assert.deepStrictEqual(replaceRoot(cons("SE", nil), s6, s7), split(solid("orange"), solid("purple"), solid("yellow"), s7));    

    // 0-1-many hueristic, many recursive call case (8 cases)
    assert.deepStrictEqual(replaceRoot(cons("NW", cons("NE", nil)), s8, s5), split(split(solid("yellow"), s5, solid("white"), solid("purple")), split(solid("yellow"), solid("red"), solid("green"), solid("blue")), split(solid("green"), solid("red"), solid("blue"), solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))));
    assert.deepStrictEqual(replaceRoot(cons("NW", cons("NE", nil)), s8, s6), split(split(solid("yellow"), s6, solid("white"), solid("purple")), split(solid("yellow"), solid("red"), solid("green"), solid("blue")), split(solid("green"), solid("red"), solid("blue"), solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))));
    
    assert.deepStrictEqual(replaceRoot(cons("NW", cons("NW", nil)), s8, s7), split(split(s7, solid("red"), solid("white"), solid("purple")), split(solid("yellow"), solid("red"), solid("green"), solid("blue")), split(solid("green"), solid("red"), solid("blue"), solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))));
    assert.deepStrictEqual(replaceRoot(cons("NW", cons("NW", nil)), s8, s6), split(split(s6, solid("red"), solid("white"), solid("purple")), split(solid("yellow"), solid("red"), solid("green"), solid("blue")), split(solid("green"), solid("red"), solid("blue"), solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))));

    assert.deepStrictEqual(replaceRoot(cons("SW", cons("SW", nil)), s8, s7), split(split(solid("yellow"), solid("red"), solid("white"), solid("purple")), split(solid("yellow"), solid("red"), solid("green"), solid("blue")), split(solid("green"), solid("red"), s7, solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))));
    assert.deepStrictEqual(replaceRoot(cons("SW", cons("SW", nil)), s8, s5), split(split(solid("yellow"), solid("red"), solid("white"), solid("purple")), split(solid("yellow"), solid("red"), solid("green"), solid("blue")), split(solid("green"), solid("red"), s5, solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))));

    assert.deepStrictEqual(replaceRoot(cons("NE", cons("SW", nil)), s8, s6), split(split(solid("yellow"), solid("red"), solid("white"), solid("purple")), split(solid("yellow"), solid("red"), s6, solid("blue")), split(solid("green"), solid("red"), solid("blue"), solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))));
    assert.deepStrictEqual(replaceRoot(cons("NE", cons("SW", nil)), s8, s7), split(split(solid("yellow"), solid("red"), solid("white"), solid("purple")), split(solid("yellow"), solid("red"), s7, solid("blue")), split(solid("green"), solid("red"), solid("blue"), solid("yellow")),split(solid("blue"), solid("red"), solid("white"), solid("orange"))));
  })

});
