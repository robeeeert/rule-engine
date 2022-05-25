import { BaseRuleSet, TRule } from "../../src/index"

export interface IGame {
    state: "running" | "over";
    maxScore: number;
    playerAScore: number;
    playerBScore: number;
}
export interface IRoundEnv {
    game: IGame;
    playerAWeapon: TWeapon | undefined;
    playerBWeapon: TWeapon | undefined;
}

export type TWeapon = "rock" | "scissors" | "paper"

export interface IRoundResult {
    type: "success" | "error";
    result: "playerAWon" | "playerBWon" | "even" | undefined;
}

export class RoundRuleSet extends BaseRuleSet<IRoundEnv, IRoundResult> {
    getRules(): readonly TRule<IRoundEnv, IRoundResult>[] {
        return [
            {
                type: "precondition",
                displayName: "Game has to be running",
                test({ game }, result) {
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
                apply({ game }, { result }) {
                    if (result === "playerAWon") {
                        game.playerAScore += 1
                    } else if (result === "playerBWon") {
                        game.playerBScore += 1
                    }
                }
            },
            {
                type: "rule",
                displayName: "End game if one player reaches max score",
                doesApply() { return true },
                apply(env, { result }) {
                    if (env.game.playerAScore === env.game.maxScore || env.game.playerBScore === env.game.maxScore) {
                        env.game.state = "over"
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