import { NextFunction, Response } from "express";
import { RequestWithBody } from "../interface/interface";
import { clientPackageVersion, serverPackageVersion } from "../server";

const version = (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  const versionsObj = { clientPackageVersion, serverPackageVersion }
  res.status(200).send(versionsObj);
};

module.exports = version;
