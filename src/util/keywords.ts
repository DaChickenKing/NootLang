import { VariableManager } from "../structures/variableManager";
import { Arguments } from "../structures/arguments";
import { NLVarType, types, NLVariable, isType, convertType } from "../structures/variable";
import type { Std } from "../structures/compiler";
export type Keyword = (args: Arguments, variables: VariableManager, std: Std) => unknown;
export namespace keywords {
	const getArg = (args: Arguments, std: Std, error: string) => {
		const valIndex = args.skipIndex();
		if (!args.indexExists(valIndex)) std.err(`${error}: No value specified.`);
		return args.getAtIndex(valIndex)!;
	};
	// Get argument while allowing variables.
	const getArgVars = (args: Arguments, std: Std, variables: VariableManager, error: string) => {
		const arg = getArg(args, std, `${error}: No value specified.`);
		if (variables.hasVariable(arg)) return variables.getVariable(arg).value;
		return arg;
	};
	const getVar = (args: Arguments, std: Std, variables: VariableManager, error: string) => {
		const arg = getArg(args, std, error);
		if (!variables.hasVariable(arg)) std.err(`${error}: Variable ${arg} was not found.`);
		return variables.getVariable(arg);
	};
	const changeVar = (
		args: Arguments,
		std: Std,
		variables: VariableManager,
		error: string,
		func: (vari: NLVariable, val: unknown) => unknown
	) => {
		const variable = getVar(args, std, variables, error);
		const value = getArgVars(args, std, variables, error);
		if (!isType(variable.type, value)) std.err(`${error}: Value ${value} is not of type ${variable.type}.`);
		func(variable, convertType(variable.type, value));
	};
	export const noot: Keyword = (args, variables, std) => {
		const type = getArg(args, std, "NootError") as NLVarType;
		if (!types.includes(type)) std.err(`NootError: Invalid type ${type}.`);
		const varname = getArg(args, std, "NootError");
		variables.newVariable(type, varname);
	};
	export const treatment: Keyword = (args, variables, std) => {
		const variable = getArgVars(args, std, variables, "TreatmentError");
		console.log(variable);
	};
	export const circumcise: Keyword = (args, variables, std) =>
		changeVar(args, std, variables, "CircumcisionError", (vari, val) => (vari.value = val as any));
	export const ejaculate: Keyword = (args, variables, std) =>
		changeVar(args, std, variables, "EjaculationError", (vari, val) => {
			const operation = getArg(args, std, "EjaculationError");
			if (operation !== "+" && typeof vari.value !== "number") std.err(`EjaculationError: Any operation that is not adding must use a numeric type.`) 
			switch (operation) {
				case "+": {
					vari.value += val as any;
					break;
				}
				case "-": {
					(vari.value as number) -= val as any;
					break;
				}
				case "*": {
					(vari.value as number) *= val as any;
					break;
				}
				case "/": {
					(vari.value as number) /= val as any;
					break;
				}
			}
		});
	export const obtain: Keyword = async(args, variables, std) => {
		const variable = getVar(args, std, variables, "ObtainmentError");
		const value = await std.in();
		if (!isType(variable.type, value)) std.err(`Value ${value} is not of type ${variable.type}`);
		variable.value = convertType(variable.type, value);
	}
}
