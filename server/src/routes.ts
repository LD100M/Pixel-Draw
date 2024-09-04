import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import {MutableMap, createMap} from "./map";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

const folder: MutableMap = createMap();

/** 
 * Returns a greeting message if "name" is provided in query params
 * @param req request to respond to
 * @param res object to send response with
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }

  res.send({greeting: `Hi, ${name}`});
};

/** 
 * Save a file name with its content if both the name and the content
 * was accepted
 * @param req request to respond to
 * @param res object to send response with
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  
  const name = first(req.body.name);

  if(name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  
  const content = req.body.content; 
  if(content === undefined) {
    res.status(400).send('required argument "content" was missing' );
    return;
  }

  folder.set_value(name, content);
  res.send({saved: true});
}

/** 
 * Load a file with both its name and content if both the name and 
 * the content was accepted
 * @param req request to respond to
 * @param res object to send response with
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if(name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  
  if(!folder.contains_key(name)) {
    res.status(404).send('no file was previously saved with that name');
    return;
  }
  
  res.send({name: name, content: folder.get_value(name)});
}

/** 
 * Load a list of file names
 * @param req request to respond to
 * @param res object to send response with
 */
export const listName = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({names: folder.get_keys()});
}

/** 
 * Used in tests to set the folder map back to empty. 
 * (exported ONLY for testing)
 */
export const resetFolderForTesting = (): void => {
  folder.clear_map();
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
