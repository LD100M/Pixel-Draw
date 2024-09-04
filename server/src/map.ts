/** represents a list of pairs (key, value), where value is the corresponded value to the key*/
export interface MutableMap {
    /**
     * Determines if the given key is within a pair in obj
     * @param key: key to determine if the list contains
     * @returns a boolean value indicating whether the given key is in obj. 
    */
    contains_key: (key: string) => boolean;

    /**
    * Gets the value paired with the first instance of the given key 
    * in obj. 
    * @param key: key to find the corresponding value for
    * @returns the first instance of the given key
    * @throws Error if the key to look for is not in obj
    */
    get_value: (key: string) => unknown;

    /**
     * Set a value for a given key in obj, replacing the current value 
     * if a pair with the given key already exists
     * @param key: key to set the value for 
     * @param val: the value to replace the original value with for the given key
     * @returns a boolean value indicating if a value was replaced
     * @modifies obj
     * @effects obj = cons((key, val), obj)
     */
    set_value: (key: string, val: unknown) => boolean; 

    /**
     * clear all pairs from obj
     * @modifies: obj
     * @effects obj = nil
     */
    clear_map: () => void; 

    /**
     * gets all the keys in obj
     * @return a list of keys from obj
     */
    get_keys: () => string[];
}

// Implementation of the Map interface that includes features like
// checking if there is some value associated with a given key in the map, 
// getting the value associated with a given key if such a pair exists in the map,
// setting a value for a given key in the map, replacing the current value if a pair 
// with the given key already exists, and clearing all pairs from the map. 
class SimpleMap implements MutableMap { 

    // AF: obj = this.map
    map: Map <string, unknown>; 

    /** 
    * create an instance of SimpleMap 
    * @effect obj = nil
    */
    constructor() {
        this.map = new Map<string, unknown>; 
    }

    contains_key = (key: string): boolean => {
        return this.map.has(key); 
    }

    get_value = (key: string): unknown => {
        if(!this.map.has(key)) {
            throw new Error();
        }
        return this.map.get(key); 
    }

    set_value = (key: string, val: unknown): boolean => {
        if(!this.contains_key(key)) {
            this.map.set(key, val);
            return true;
        }
        this.map.set(key, val);
        return false; 
    }

    clear_map = (): void => {
        this.map = new Map<string, unknown>; 
    }

    get_keys = (): string[] => {
        return Array.from(this.map.keys());
    }
}

const newMap: MutableMap = new SimpleMap();
/**
 * function returns an instance of MutableMap that stores a list of key-value pairs
 * @returns an instance of MutableMap that stores a list of key-value pairs
 */
export const createMap = (): MutableMap => {
    return newMap;
}
