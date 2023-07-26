import { resourcesMeta } from "🛠️/restful/meta.ts";
import { AuthError } from "🛠️/types.ts";

export const BACK_LINK_ALL = [resourcesMeta.polls.texts.all, "/"] as const;
export const GITHUB_REPO_URL = "http://github.com/martpet/polls";

export const authErrorsTexts: Record<AuthError, string> = {
  unknown_auth_error: "Случи се непредвидена грешка. Моля, опитайте отново.",
  access_denied: "Вие отказахте достъп до Вашия Google профил.",
};

// Styles
export const PROSE = "prose prose-slate dark:prose-invert max-w-none";
export const SIDE_SPACE = "px-4 lg:px-8";
export const BORDER_COLOR = "border-slate-200 dark:border-slate-800";
export const LINK_COLOR = "text-blue-700 font-medium";
export const COMMA_ITEMS = "[&>*:not(:last-child)]:after:content-[',_']";
