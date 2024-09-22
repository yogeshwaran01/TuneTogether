export interface TeamBase
{
    name: string;
}

export interface Team extends TeamBase
{
    members: Member[]
}

export interface MemberBase
{
    name: string,
    type: MemberType,
}

export interface Member extends MemberBase
{
    
}

export enum MemberType
{
    ADMIN,
    MANAGER,
    MEMBER,
}

export interface Teams
{
   [key: string]: Team; 
}