/**
 * Wrapper de ResumenDestajos con manejo de estados
 * Cumple con las reglas: Loading, Empty, WithData
 */

import { ViewState } from "@/app/components/states";
import {
  ResumenDestajosStateLoading,
  ResumenDestajosStateEmpty,
} from "@/app/components/resumen-destajos";
import ResumenDestajos from "@/app/components/ResumenDestajos";

interface DesatajistaImporte {
  inicial: string;
  nombre: string;
  importe: number;
}

interface ObraResumen {
  nombre: string;
  codigo: string;
  destajistas: DesatajistaImporte[];
}

interface Props {
  viewState?: ViewState;
  obras?: ObraResumen[];
  onBack: () => void;
}

export default function ResumenDestajosWithStates({
  viewState = "data",
  obras = [],
  onBack,
}: Props) {
  // Estado Loading
  if (viewState === "loading") {
    return <ResumenDestajosStateLoading onBack={onBack} />;
  }

  // Estado Empty
  if (viewState === "empty" || obras.length === 0) {
    return <ResumenDestajosStateEmpty onBack={onBack} />;
  }

  // Estado WithData
  return <ResumenDestajos obras={obras} onBack={onBack} />;
}
