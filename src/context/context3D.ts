import { createContext, useContext } from "react";

export function use3D() {
    return useContext(context3D)
}

export const context3D = createContext(null)

export function use3DGame() {
    return useContext(gameContext)
}

export const gameContext = createContext(null)