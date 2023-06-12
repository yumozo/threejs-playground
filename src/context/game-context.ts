import { Game } from "@game/game";
import { createContext, useContext } from "react";

export function useGame() {
    return useContext(gameContext)
}

export const gameContext = createContext(null as null | Game)