/**
 * Rules interpret a given input in the context of a given environment.
 * They have a method to test whether the Rule is applicable or not and a method
 * which holds the actual implementation.
 * The Rule may expect a Result object which can be used to return results to the caller
 * that should not be part of the environment.
 * That Result object can then be evaluated after a RuleSet has been executed and may be used
 * to trigger another RuleSet based on the values in the Result object. 
 * 
 * @template TEnv Environment type that the rule is working on and that it may modify during execution
 * @template TResult Apply method may modify members of that object as a result of the rule
 */
export interface IRule<TEnv, TResult extends object | undefined = undefined> {
    type: "rule";
    /**
     * Descriptive name of the rule.
     * Is also displayed in error messages.
     */
    displayName: string;
    /**
     * Determines whether the rule is applicable gven the specified environment.
     * 
     * @param env Environment
     */
    doesApply(env: TEnv): boolean;
    /**
     * Executes the rule in the given environment.
     * May disrupt the rule chain by returning false;
     * 
     * @param env Environment
     * @param result An object that contains a result state or undefined
     * @returns whether the rule chain should be aborted. Undefined does not abort the chain.
     */
    apply(env: TEnv, result: TResult): boolean | void;
}

/**
 * Preconditions are used to test whether a RuleSet should be executed.
 * They must not alter the environment or have any other side effects.
 */
export interface IRulePrecondition<TEnv, TResult extends object | undefined = undefined> {
    type: "precondition";
    /**
     * Descriptive name of the precondition.
     * Is also displayed in error messages.
     */
    displayName: string;

    /**
     * Some precondition that has to be met for the execution of the upcoming rules.
     * @param env Environment
     * @returns whether the rule chain should be continued.
     */
    test(env: TEnv, result: TResult): boolean;
}

/**
 * A union type of Preconditions and Rules that can be fed into a RuleSet.
 * Typically Preconditions should be put before any Rule in a RuleSet, but
 * may be used in between Rules to determine whether the RuleSet execution
 * should continue after a certain set of Rules.
 */
export type TRule<TEnv, TResult extends object | undefined = undefined> = IRule<TEnv, TResult> | IRulePrecondition<TEnv, TResult>;

/**
 * A RuleSet typically has a ordered collection of TRule objects and offers
 * logic to execute them.
 * It's recommended to extend the BaseRuleSet abstract class which implements
 * some boiler plate code.
 */
export interface IRuleSet<TEnv, TResult extends object | undefined = undefined> {
    /**
     * Executes all Rules and Preconditions in the given order with the given enviroment.
     * @param env Context in which the Rules and Preconditions are being executed
     * @returns the mutated Result object returned initially from initResult method
     */
    exec(env: TEnv): TResult;
}

/**
 * Basic implementation of the IRuleSet which can be extended to avoid boilerplate code.
 */
export abstract class BaseRuleSet<TEnv, TResult extends object | undefined = undefined> implements IRuleSet<TEnv, TResult> {
    /**
     * Used by the exec method to get the rules for execution.
     */
    abstract getRules(): readonly TRule<TEnv, TResult>[];

    /**
     * Used by the exec function to get the initial Result object
     * which is passed to the Rules.
     */
    abstract initResult(): TResult;

    /**
     * Executes all Rules and Preconditions in the given order with the given enviroment.
     * @param env Context in which the Rules and Preconditions are being executed
     * @param debug If true, prints out each step's display name
     * @returns the mutated Result object returned initially from initResult method
     */
    exec(env: TEnv, debug = false): TResult {
        const result = this.initResult();
        this.getRules().every(rule => {
            if (debug) {
                console.log("Executing step " + rule.displayName)
            }
            switch (rule.type) {
                case "precondition": return rule.test(env, result);
                case "rule": return !rule.doesApply(env) || rule.apply(env, result) !== false;
            }
        });
        return result;
    }
}