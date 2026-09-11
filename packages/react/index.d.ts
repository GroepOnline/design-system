import * as React from "react";
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"primary"|"subtle"|"outline"|"ghost"|"destructive"; size?: "sm"|"md"|"lg"; pending?: boolean };
export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; variant?: "ghost"|"outline"|"solid"; pending?: boolean };
export const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral"|"accent"|"success"|"warning"|"danger" };
export const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLSpanElement>>;
export const Input: React.ForwardRefExoticComponent<React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>;
export const Textarea: React.ForwardRefExoticComponent<React.TextareaHTMLAttributes<HTMLTextAreaElement> & React.RefAttributes<HTMLTextAreaElement>>;
export const Separator: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal"|"vertical" } & React.RefAttributes<HTMLDivElement>>;
export function Alert(props: React.HTMLAttributes<HTMLDivElement> & { tone?: "neutral"|"accent"|"success"|"warning"|"danger" }): React.ReactElement;
export function EmptyState(props: React.HTMLAttributes<HTMLElement> & { title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode }): React.ReactElement;
export function Activity(props: React.HTMLAttributes<HTMLDivElement> & { state?: "idle"|"running"|"waiting"|"complete"|"error"; label: React.ReactNode; detail?: React.ReactNode; elapsed?: React.ReactNode }): React.ReactElement;

export type MotionKind = "beam"|"halo"|"sweep"|"ripple"|"glide"|"status";
export type MotionSurfaceProps = React.HTMLAttributes<HTMLElement> & { as?: React.ElementType; motion?: MotionKind; active?: boolean };
export const MotionSurface: React.ForwardRefExoticComponent<MotionSurfaceProps & React.RefAttributes<HTMLElement>>;
export function attachPressRipple(element: HTMLElement | null): () => void;
