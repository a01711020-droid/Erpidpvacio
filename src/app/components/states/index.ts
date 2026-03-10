/**
 * Barrel export para componentes de estado
 */

export { LoadingState } from "./LoadingState";
export { EmptyState } from "./EmptyState";
export { ErrorState } from "./ErrorState";

export type ViewState = "loading" | "error" | "empty" | "data";
