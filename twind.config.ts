import { defineConfig } from "@twind/core";
import presetForms from "@twind/preset-forms";
import presetTailwind from "@twind/preset-tailwind";
import presetTypography from "@twind/preset-typography";

export const configURL = import.meta.url;

export default {
  ...defineConfig({
    presets: [
      presetTailwind(),
      presetTypography(),
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      presetForms(),
    ],
  }),
  selfURL: import.meta.url,
};
