import { isString } from 'util';
import express from 'express';
import path from 'path';

const entries = require('object.entries');

const splitByLastDot = (str: string) => {
  const index = str.lastIndexOf('.');
  return [str.slice(0, index), str.slice(index + 1)];
};

const cwd = process.cwd();

export const mapRoutes = (
  routes: any,
  pathToController: string,
  middlewareGenerals = []
) => {
  const router = express.Router();
  let requestMethodPath;
  let requestMethod;

  let controllerMethod: string;
  let controller: string;

  let handler;

  let myPath: string;
  const myPathToController = path.join(cwd, pathToController);

  const routesArr = entries(routes);

  routesArr.map((value: string) => {
    let middlewares: any;
    // to let use an array or only one function as general middlewares
    if (Array.isArray(middlewareGenerals)) {
      middlewares = [...middlewareGenerals];
    } else if (typeof middlewareGenerals === 'function') {
      middlewares = [middlewareGenerals];
    } else {
      middlewares = [];
    }
    requestMethodPath = value[0].replace(/\s\s+/g, ' ');
    requestMethod = requestMethodPath.split(' ')[0].toLocaleLowerCase();
    myPath = requestMethodPath.split(' ')[1] as any;

    if (isString(value[1])) {
      controller = splitByLastDot(value[1])[0];
      controllerMethod = splitByLastDot(value[1])[1];
    } else {
      // contains middlewares and other configuration
      const props = value[1] as any;

      // Extract controller paths
      if (props.path !== undefined) {
        controller = splitByLastDot(props.path)[0];
        controllerMethod = splitByLastDot(props.path)[1];
      }

      // Extract middlewares.
      if (props.middlewares !== undefined && Array.isArray(props.middlewares)) {
        middlewares.push(...props.middlewares);
      }
    }
    middlewares = middlewares.filter((el: any) => el != null);

    let contr: any;
    try {
      const imported = require(`${myPathToController}${controller}`);
      contr = imported[controller]();
    } catch (err) {
      console.error('Failed to load: ', `${myPathToController}${controller}`);
      console.error(err);
    }

    (router as any)
      .route(myPath)
      [requestMethod](middlewares, contr[controllerMethod]);
  });

  return router;
};

export default mapRoutes;
