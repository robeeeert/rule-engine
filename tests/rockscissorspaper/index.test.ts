import { expect } from "chai";
import { IGame, IRoundResult, RoundRuleSet, TWeapon } from "../../examples/rockpaperscissors";

class Game implements IGame {
    state: "running" | "over" = "running";
    playerAScore = 0;
    playerBScore = 0;
    playerAWeapon: TWeapon | undefined = undefined;
    playerBWeapon: TWeapon | undefined = undefined;
}

describe("Rock Paper Scissors game", () => {
    const game = new Game();
    const engine = new RoundRuleSet()

    context("after first round", () => {
        let result: IRoundResult | undefined;
        before(() => {
            game.playerAWeapon = "rock"
            game.playerBWeapon = "scissors"
            result = engine.exec(game);
        })

        it("should have player A wins as result", () => {
            expect(result!.result).to.eq("playerAWon")
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
        let result: IRoundResult | undefined;
        before(() => {
            game.playerAWeapon = "rock"
            game.playerBWeapon = "rock"
            result = engine.exec(game);
        })

        it("should have even as result", () => {
            expect(result!.result).to.eq("even")
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
        let result: IRoundResult | undefined;
        before(() => {
            game.playerAWeapon = "scissors"
            game.playerBWeapon = "rock"
            result = engine.exec(game);
        })

        it("should have playerBWon as result", () => {
            expect(result!.result).to.eq("playerBWon")
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
        let result: IRoundResult | undefined;
        before(() => {
            game.playerAWeapon = "rock"
            game.playerBWeapon = "paper"
            result = engine.exec(game);
        })

        it("should have playerBWon as result", () => {
            expect(result!.result).to.eq("playerBWon")
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
        let result: IRoundResult | undefined;
        before(() => {
            game.playerAWeapon = "paper"
            game.playerBWeapon = "scissors"
            result = engine.exec(game);
        })

        it("should have playerBWon as result", () => {
            expect(result!.result).to.eq("playerBWon")
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
        let result: IRoundResult | undefined;
        before(() => {
            game.playerAWeapon = "paper"
            game.playerBWeapon = "scissors"
            result = engine.exec(game);
        })

        it("should return an error as result", () => {
            expect(result!.type).to.eq("error")
        })

        it("should not have a result field in the result", () => {
            expect(result!.result).to.eq(undefined)
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