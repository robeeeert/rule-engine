import { BaseRuleSet, TRule } from "../../src/index"

export interface IGame {
    state: "running" | "over";
    playerAScore: number;
    playerBScore: number;
    playerAWeapon: TWeapon | undefined;
    playerBWeapon: TWeapon | undefined;
}

export type TWeapon = "rock" | "scissors" | "paper"

export interface IRoundResult {
    type: "success" | "error";
    result: "playerAWon" | "playerBWon" | "even" | undefined;
}

export class RoundRuleSet extends BaseRuleSet<IGame, IRoundResult> {
    getRules(): readonly TRule<IGame, IRoundResult>[] {
        return [
            {
                type: "precondition",
                displayName: "Game has to be running",
                test(game, result) {
                    const valid = game.state === "running"
                    result.type = "error";
                    result.result = undefined;
                    return valid;
                }
            },
            {
                type: "rule",
                displayName: "Determine winner",
                doesApply() { return true },
                apply({ playerAWeapon, playerBWeapon }, result) {
                    if (playerAWeapon === playerBWeapon) {
                        result.result = "even"
                    } else if (
                        (playerAWeapon === "paper" && playerBWeapon === "rock") ||
                        (playerAWeapon === "rock" && playerBWeapon === "scissors") ||
                        (playerAWeapon === "scissors" && playerBWeapon === "paper")
                    ) {
                        result.result = "playerAWon"
                    } else {
                        result.result = "playerBWon"
                    }
                }
            },
            {
                type: "rule",
                displayName: "Update game score based on result",
                doesApply() { return true },
                apply(game, { result }) {
                    if (result === "playerAWon") {
                        game.playerAScore += 1
                    } else if (result === "playerBWon") {
                        game.playerBScore += 1
                    }
                }
            },
            {
                type: "rule",
                displayName: "",
                doesApply() { return true },
                apply(game, { result }) {
                    const maxScore = 3;
                    if (game.playerAScore === maxScore || game.playerBScore === maxScore) {
                        game.state = "over"
                    }
                }
            }
        ]
    }

    initResult(): IRoundResult {
        return {
            type: "success",
            result: undefined
        }
    }
}