/** Apparence commune des boutons : liens stylés (`ButtonLink`) et vrais `<button>` (formulaire). */
export type ButtonVariant = 'primary' | 'secondary';

export const BUTTON_BASE =
  'inline-flex min-h-(--pp-size-control-height) items-center justify-center gap-2 rounded-control border px-4 text-base font-medium no-underline transition-colors duration-(--pp-duration-base)';

export const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: 'border-accent bg-accent text-on-accent hover:border-fg hover:bg-fg hover:text-bg',
  secondary: 'border-control text-fg hover:border-fg',
};
