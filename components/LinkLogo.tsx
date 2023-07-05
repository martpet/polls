export default function LinkLogo() {
  const classes = [
    "flex",
    "rounded",
    "items-center",
    "gap-1.5",
    "text-xl",
    "text-slate-900",
    "font-medium",
    "dark:text-slate-100",
    'before:content-["🗳️"]',
    "before:relative",
    "before:top-[-1px]",
    "before:text-3xl",
  ];
  return (
    <a aria-label="Начална страница" href="/" class={classes.join(" ")}>
      гласуване
    </a>
  );
}
