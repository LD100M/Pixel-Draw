import * as assert from 'assert';
import {createMap, MutableMap} from './map';

describe("map", function() {
    let map1: MutableMap = createMap();

    it("contains_key", function() {
        // subdomain: straight line code
        map1.set_value("key1", 1n); 
        assert.deepStrictEqual(map1.contains_key("key1"), true); 
        map1.set_value("key2", 2n); 
        assert.deepStrictEqual(map1.contains_key("key2"), true);
    }) 

    it("get_value", function() {
        // subdomain: straight line code
        assert.deepStrictEqual(map1.get_value("key1"), 1n);
        assert.deepStrictEqual(map1.get_value("key2"), 2n);
        assert.throws(() => map1.get_value("key3"), Error);
        assert.throws(() => map1.get_value("key4"), Error);
    })

    it("set_value", function() {
        // subdomain: straight line code
        map1.set_value("key3", 3n); 
        assert.deepStrictEqual(map1.contains_key("key3"), true);
        assert.deepStrictEqual(map1.get_value("key3"), 3n);
        map1.set_value("key4", 4n);
        assert.deepStrictEqual(map1.contains_key("key4"), true); 
        assert.deepStrictEqual(map1.get_value("key4"), 4n);
    })

    it("clear_map", function() {
        // subdomain: straight line code, test if the map has been cleared
        map1.set_value("key10", 10n);
        map1.clear_map();
        assert.deepStrictEqual(map1.contains_key("key10"), false); 
        map1.set_value("key11", 11n);
        map1.clear_map();
        assert.deepStrictEqual(map1.contains_key("key11"), false);
    }) 

    it("get_keys", function() {
        // subdomain: straight line code
        assert.deepStrictEqual(map1.set_value("key1", 2n), true);
        assert.deepStrictEqual(map1.set_value("key2", 3n), true);
        assert.deepStrictEqual(map1.get_keys(), ["key1", "key2"]);
        assert.deepStrictEqual(map1.set_value("key3", 7n), true);
        assert.deepStrictEqual(map1.set_value("key4", 9n), true);
        assert.deepStrictEqual(map1.get_keys(), ["key1", "key2", "key3", "key4"]);
    })
})