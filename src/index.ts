/** Andrea Tino - 2020 */

import { ParseCommand } from "./commands/parse";

// Register command handlers.
let args = ParseCommand.getHandler();

// Execute
args.parse();
