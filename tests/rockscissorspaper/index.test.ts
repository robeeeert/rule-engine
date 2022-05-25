import { expect } from "chai";
import { IRoundEnv, IGame, IRoundResult, RoundRuleSet, TWeapon } from "../../examples/rockpaperscissors";

class Game implements IGame {
    state: IGame["state"] = "running"
    playerAScore = 0
    playerBScore = 0
    maxScore = 3
}

describe("Rock Paper Scissors game", () => {
    const game = new Game();
    const engine = new RoundRuleSet()

    context("after first round", () => {
        let env: IRoundEnv | undefined;
        before(() => {
            env = {
                playerAWeapon: "rock",
                playerBWeapon: "scissors",
                game,
                result: {
                    type: "pending",
                    result: undefined
                }
            }
            engine.exec(env);
        })

        it("should have player A wins as result", () => {
            expect(env!.result.result).to.eq("playerAWon")
        })

        it("should increase player A's score", () => {
            expect(game.playerAScore).to.eq(1);
        })

        it("should not increase player B's score", () => {
            expect(game.playerBScore).to.eq(0);
        })

        it("should not end the game", () => {
            expect(game.state).to.eq("running")
        })
    })

    context("after second round", () => {
        let env: IRoundEnv | undefined;
        before(() => {
            env = {
                playerAWeapon: "rock",
                playerBWeapon: "rock",
                game,
                result: {
                    type: "pending",
                    result: undefined
                }
            }
            engine.exec(env);
        })

        it("should have even as result", () => {
            expect(env!.result.result).to.eq("even")
        })

        it("should not increase player A's score", () => {
            expect(game.playerAScore).to.eq(1);
        })

        it("should not increase player B's score", () => {
            expect(game.playerBScore).to.eq(0);
        })

        it("should not end the game", () => {
            expect(game.state).to.eq("running")
        })
    })

    context("after third round", () => {
        let env: IRoundEnv | undefined;
        before(() => {
            env = {
                playerAWeapon: "scissors",
                playerBWeapon: "rock",
                game,
                result: {
                    type: "pending",
                    result: undefined
                }
            }
            engine.exec(env);
        })

        it("should have playerBWon as result", () => {
            expect(env!.result.result).to.eq("playerBWon")
        })

        it("should not increase player A's score", () => {
            expect(game.playerAScore).to.eq(1);
        })

        it("should increase player B's score", () => {
            expect(game.playerBScore).to.eq(1);
        })

        it("should not end the game", () => {
            expect(game.state).to.eq("running")
        })
    })

    context("after fourth round", () => {
        let env: IRoundEnv | undefined;
        before(() => {
            env = {
                playerAWeapon: "rock",
                playerBWeapon: "paper",
                game,
                result: {
                    type: "pending",
                    result: undefined
                }
            }
            engine.exec(env);
        })

        it("should have playerBWon as result", () => {
            expect(env!.result.result).to.eq("playerBWon")
        })

        it("should not increase player A's score", () => {
            expect(game.playerAScore).to.eq(1);
        })

        it("should increase player B's score", () => {
            expect(game.playerBScore).to.eq(2);
        })

        it("should not end the game", () => {
            expect(game.state).to.eq("running")
        })
    })

    context("after final round", () => {
        let env: IRoundEnv | undefined;
        before(() => {
            env = {
                playerAWeapon: "paper",
                playerBWeapon: "scissors",
                game,
                result: {
                    type: "pending",
                    result: undefined
                }
            }
            engine.exec(env);
        })

        it("should have playerBWon as result", () => {
            expect(env!.result.result).to.eq("playerBWon")
        })

        it("should not increase player A's score", () => {
            expect(game.playerAScore).to.eq(1);
        })

        it("should increase player B's score", () => {
            expect(game.playerBScore).to.eq(3);
        })

        it("should end the game", () => {
            expect(game.state).to.eq("over")
        })
    })

    context("after game over", () => {
        let env: IRoundEnv | undefined;
        before(() => {
            env = {
                playerAWeapon: "paper",
                playerBWeapon: "scissors",
                game,
                result: {
                    type: "pending",
                    result: undefined
                }
            }
            engine.exec(env);
        })

        it("should return an error as result", () => {
            expect(env!.result.type).to.eq("error")
        })

        it("should not have a result field in the result", () => {
            expect(env!.result.result).to.eq(undefined)
        })

        it("should not increase player A's score", () => {
            expect(game.playerAScore).to.eq(1);
        })

        it("should not increase player B's score", () => {
            expect(game.playerBScore).to.eq(3);
        })

        it("should not alter the game's state", () => {
            expect(game.state).to.eq("over")
        })
    })
})