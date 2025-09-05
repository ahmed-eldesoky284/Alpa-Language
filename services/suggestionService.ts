import { COMMAND_MAP, CommandDef } from '../constants.ts';

// FIX: Cast `cmd` to `CommandDef` to resolve a type inference issue with `Object.values`.
const allCommands: string[] = Object.values(COMMAND_MAP).flatMap(cmd => (cmd as CommandDef).aliases);

/**
 * Generates command and argument suggestions based on the current input value.
 * @param inputValue The full string from the input field.
 * @returns An array of string suggestions.
 */
export const getSuggestions = (inputValue: string): string[] => {
    const lowerCaseInput = inputValue.toLowerCase();
    const parts = lowerCaseInput.split(' ').filter(Boolean);
    
    // Determine the part of the input we're currently trying to complete
    const currentPart = inputValue.endsWith(' ') ? '' : parts[parts.length - 1] || '';

    // Case 1: Typing the command (the first word)
    if (parts.length <= 1 && !inputValue.endsWith(' ')) {
        if (currentPart === '') return [];
        return allCommands.filter(cmd => cmd.startsWith(currentPart));
    }
    
    // Case 2: Typing an argument (after the first word)
    const commandAlias = parts[0];
    if (!commandAlias) return [];

    const commandKey = Object.keys(COMMAND_MAP).find(key => 
        (COMMAND_MAP[key as keyof typeof COMMAND_MAP] as CommandDef).aliases.includes(commandAlias)
    );

    if (commandKey) {
        const cmdDef = COMMAND_MAP[commandKey as keyof typeof COMMAND_MAP] as CommandDef;
        // Check if the command has predefined arguments
        if (cmdDef.args) {
            const argPart = parts.length > 1 ? currentPart : '';

            // If user just typed a space after the command, show all args
            if (argPart === '' && inputValue.endsWith(' ')) {
                return cmdDef.args;
            }
            // Otherwise, filter args based on what they've typed
            return cmdDef.args.filter(arg => arg.startsWith(argPart));
        }
    }

    // No suggestions if the command is unknown or doesn't take predefined args
    return [];
};