import { Router, Request, Response } from "express";
import * as TeamService from "./team.service";
import { TeamBase } from "./team.interface";

export const teamRouter = Router();

teamRouter.post("/new", async (req: Request, res: Response) => {
    const team: TeamBase = req.body as unknown as TeamBase;
    await TeamService.createNewTeam(team);
    res.status(201).json(team);
});