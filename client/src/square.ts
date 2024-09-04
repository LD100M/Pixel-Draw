import { List } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

/** 
 * Converts a string to a color (or throws an exception if not a color). 
 * @param s string to convert to color
 */
export const toColor = (s: string): Color => {
  switch (s) {
    case "white": case "red": case "orange": case "yellow":
    case "green": case "blue": case "purple":
      return s;

    default:
      throw new Error(`unknown color "${s}"`);
  }
};

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

/** 
 * Returns a solid square of the given color. 
 * @param color of square to return
 * @returns square of given color
 */
export const solid = (color: Color): Square => {
  return {kind: "solid", color: color};
};

/** 
 * Returns a square that splits into the four given parts. 
 * @param nw square in nw corner of returned square
 * @param ne square in ne corner of returned square
 * @param sw square in sw corner of returned square
 * @param se square in se corner of returned square
 * @returns new square composed of given squares
 */
export const split =
    (nw: Square, ne: Square, sw: Square, se: Square): Square => {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
};

export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;


/** 
 * Creats a JSON representation of given Square. 
 * @param sq to convert to JSON
 * @returns JSON describing the given square
 */
export const toJson = (sq: Square): unknown => {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
};

/** 
 * Converts a JSON description to the Square it describes. 
 * @param data in JSON form to try to parse as Square
 * @returns a Square parsed from given data
 */
export const fromJson = (data: unknown): Square => {
  if (typeof data === 'string') {
    return solid(toColor(data))
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}

/**
 * Function retrieves the square after splitting the given square according 
 * to the direction specified by the path
 * @param p: A list of directions to find the splitted square
 * @param s A square to be split
 * @returns the splitted square after splitting the given square according to
 * the direction specified by the path
 */
export const findRoot = (p: Path, s: Square): Square => {
    if(p.kind === "nil") {
      return s;
    }
    else {
      if(s.kind === "solid") {
        throw new Error();
      }
      else if(p.hd === "NW") {
        return findRoot(p.tl, s.nw);
      }
      else if(p.hd === "NE") {
        return findRoot(p.tl, s.ne);
      }
      else if(p.hd === "SW") {
        return findRoot(p.tl, s.sw);
      }
      else {
        return findRoot(p.tl, s.se);
      }
    }
}

/**
 * Function replaces the sqaure at the end of the path with a 
 * given square 
 * @param p: A list of directions to find the splitted square
 * @param s A square to be split
 * @param t: A square to replace the splitted square at the end of the path
 * @returns a square with the splitted sub part at the end of the path being
 * replace with a given square
 */
export const replaceRoot = (p: Path, s: Square, t: Square): Square => {
  if(p.kind === "nil") {
    return t;
  }
  else {
    if(s.kind === "solid") {
      throw new Error();
    }
    else if(p.hd === "NW") {
      return split(replaceRoot(p.tl, s.nw, t),s.ne,s.sw,s.se);
    }
    else if(p.hd === "NE") {
      return split(s.nw,replaceRoot(p.tl, s.ne, t),s.sw,s.se);
    }
    else if(p.hd === "SW") {
      return split(s.nw, s.ne, replaceRoot(p.tl, s.sw, t), s.se);
    }
    else {
      return split(s.nw, s.ne, s.sw, replaceRoot(p.tl, s.se, t))
    }
  }
}
