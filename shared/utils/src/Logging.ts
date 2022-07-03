/**
 * Prints a system message in the project format.
 * Wrapper for console.log.
 */
export const message = (...args: any[]) => {
    args.unshift('*');
    // eslint-disable-next-line no-console
    console.log(...args);
};

/**
 * Prints a warning message.
 */
export const warning = (...args:any[]) => {
    // if (!settings.IGNORE_WARNINGS) {
    args.unshift('* WARNING:');
    // eslint-disable-next-line no-console
    console.log(...args);
    // }
};

/**
 * Stops the process and prints an error message.
 */
export const error = (...args: any[]) => {
    args.unshift('* ERROR:');
    // eslint-disable-next-line no-console
    console.error(...args);
    // eslint-disable-next-line no-console
    console.trace();
    process.exit();
};
