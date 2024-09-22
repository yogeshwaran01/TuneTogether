import { Member, MemberBase, Team, TeamBase, Teams } from "./team.interface";

const teams: Teams = {}

export const createNewTeam = async (team: TeamBase): Promise<void> =>
{
    let newTeam: Team = {
        name: team.name,
        members: []
    }
    teams[team.name] = newTeam;
}


export const addMember = async (team: TeamBase, member: MemberBase): Promise<void> =>
{
    const newMember: Member = {
        name: member.name,
        type: member.type
    };
    teams[team.name].members.push(newMember);
}
