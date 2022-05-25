/**
 * Rules interpret a given input in the context of a given environment.
 * They have a method to test whether the Rule is applicable or not and a method
 * which holds the actual implementation.
 * A rule may alter any aspect of the given environment which will
 * be accessible further down the list of rules and after the
 * rule list execution has finished.
 * 
 * @template TEnv Environment type that the rule is working on and that it may modify during execution
 */
export interface IRule<TEnv> {
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
     * @returns whether the rule chain should be aborted. Undefined does not abort the chain.
     */
    apply(env: TEnv): boolean | void;
}

/**
 * Preconditions are used to test whether a RuleSet should be executed.
 * They must not alter the environment or have any other side effects.
 */
export interface IRulePrecondition<TEnv> {
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
    test(env: TEnv): boolean;
}

/**
 * A union type of Preconditions and Rules that can be fed into a RuleSet.
 * Typically Preconditions should be put before any Rule in a RuleSet, but
 * may be used in between Rules to determine whether the RuleSet execution
 * should continue after a certain set of Rules.
 */
export type TRule<TEnv> = IRule<TEnv> | IRulePrecondition<TEnv>;

/**
 * A RuleSet typically has a ordered collection of TRule objects and offers
 * logic to execute them.
 * It's recommended to extend the BaseRuleSet abstract class which implements
 * some boiler plate code.
 */
export interface IRuleSet<TEnv> {
    /**
     * Executes all Rules and Preconditions in the given order with the given enviroment.
     * @param env Context in which the Rules and Preconditions are being executed
     */
    exec(env: TEnv): void;
}

/**
 * Basic implementation of the IRuleSet which can be extended to avoid boilerplate code.
 */
export abstract class BaseRuleSet<TEnv> implements IRuleSet<TEnv> {
    /**
     * Used by the exec method to get the rules for execution.
     */
    abstract getRules(): readonly TRule<TEnv>[];

    /**
     * Executes all Rules and Preconditions in the given order with the given enviroment.
     * @param env Context in which the Rules and Preconditions are being executed
     * @param debug If true, prints out each step's display name
     */
    exec(env: TEnv, debug = false): void {
        this.getRules().every(rule => {
            if (debug) {
                console.log("Executing step " + rule.displayName)
            }
            switch (rule.type) {
                case "precondition": return rule.test(env);
                case "rule": return !rule.doesApply(env) || rule.apply(env) !== false;
            }
        });
    }
}