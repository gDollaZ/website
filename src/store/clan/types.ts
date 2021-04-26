import { PlayerProfile } from "@/store/player/types";
import { Ranking } from "@/store/ranking/types";
import { EGameMode } from "../typings";

export interface ClanState {
  playersClan: Clan;
  searchPlayers: PlayerProfile[];
  clanValidationError: string;
  selectedMemberShip: ClanMembership;
}

export interface ClanMembership {
  battleTag: string;
  clanId: string;
  clanName: string;
  pendingInviteFromClan: string;
}

export interface Clan {
  clanId: string;
  clanName: string;
  chiefTain: string;
  isSuccesfullyFounded: boolean;
  members: string[];
  foundingFathers: string[];
  shamans: string[];
  pendingInvites: string[];
  ranks: Ranking[];
}

export interface ClanStats {
  wins?: number,
  losses?: number,
  gameMode: EGameMode,
  games: number,
  rank?: number,
  leagueOrder?: number,
}

export enum EClanRole {
  ChiefTain = 3,
  Shaman = 2,
  Member = 1,
  Undefined = 0,
}
