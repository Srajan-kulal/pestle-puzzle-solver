import { useCallback, useEffect, useState } from "react";
import {
  type Analysis,
  type CategoryKey,
  type Factor,
  createAnalysis,
  emptyFactors,
  uid,
} from "@/lib/pestle";

const STORAGE_KEY = "pestle-analyses-v1";

interface Store {
  analyses: Analysis[];
  activeId: string | null;
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      if (Array.isArray(parsed.analyses)) return parsed;
    }
  } catch {
    // corrupted storage — start fresh
  }
  const first = createAnalysis("My first PESTLE analysis");
  return { analyses: [first], activeId: first.id };
}

function normalize(a: Analysis): Analysis {
  return { ...a, factors: { ...emptyFactors(), ...a.factors } };
}

export function usePestleStore() {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    setStore(load());
  }, []);

  useEffect(() => {
    if (store) {
      const t = setTimeout(
        () => localStorage.setItem(STORAGE_KEY, JSON.stringify(store)),
        250,
      );
      return () => clearTimeout(t);
    }
  }, [store]);

  const mutateActive = useCallback((fn: (a: Analysis) => Analysis) => {
    setStore((s) => {
      if (!s || !s.activeId) return s;
      return {
        ...s,
        analyses: s.analyses.map((a) =>
          a.id === s.activeId
            ? { ...fn(normalize(a)), updatedAt: Date.now() }
            : a,
        ),
      };
    });
  }, []);

  const active =
    store?.analyses.find((a) => a.id === store.activeId) ?? null;

  const actions = {
    createAnalysis: () => {
      const a = createAnalysis();
      setStore((s) =>
        s
          ? { analyses: [...s.analyses, a], activeId: a.id }
          : { analyses: [a], activeId: a.id },
      );
    },
    selectAnalysis: (id: string) =>
      setStore((s) => (s ? { ...s, activeId: id } : s)),
    deleteAnalysis: (id: string) =>
      setStore((s) => {
        if (!s) return s;
        const analyses = s.analyses.filter((a) => a.id !== id);
        if (!analyses.length) {
          const fresh = createAnalysis();
          return { analyses: [fresh], activeId: fresh.id };
        }
        return {
          analyses,
          activeId: s.activeId === id ? analyses[0].id : s.activeId,
        };
      }),
    duplicateAnalysis: (id: string) =>
      setStore((s) => {
        if (!s) return s;
        const src = s.analyses.find((a) => a.id === id);
        if (!src) return s;
        const copy: Analysis = {
          ...src,
          id: uid(),
          title: `${src.title || "Untitled"} (copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return {
          analyses: [...s.analyses, copy],
          activeId: copy.id,
        };
      }),
    updateMeta: (patch: Partial<Analysis>) =>
      mutateActive((a) => ({ ...a, ...patch })),
    addFactor: (category: CategoryKey, text: string) =>
      mutateActive((a) => ({
        ...a,
        factors: {
          ...a.factors,
          [category]: [
            ...a.factors[category],
            { id: uid(), text, impact: "medium", kind: "threat" },
          ],
        },
      })),
    updateFactor: (
      category: CategoryKey,
      id: string,
      patch: Partial<Factor>,
    ) =>
      mutateActive((a) => ({
        ...a,
        factors: {
          ...a.factors,
          [category]: a.factors[category].map((f) =>
            f.id === id ? { ...f, ...patch } : f,
          ),
        },
      })),
    removeFactor: (category: CategoryKey, id: string) =>
      mutateActive((a) => ({
        ...a,
        factors: {
          ...a.factors,
          [category]: a.factors[category].filter((f) => f.id !== id),
        },
      })),
    moveFactor: (category: CategoryKey, id: string, dir: -1 | 1) =>
      mutateActive((a) => {
        const list = [...a.factors[category]];
        const i = list.findIndex((f) => f.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return a;
        [list[i], list[j]] = [list[j], list[i]];
        return { ...a, factors: { ...a.factors, [category]: list } };
      }),
  };

  return {
    ready: store !== null,
    analyses: store?.analyses ?? [],
    active: active ? normalize(active) : null,
    actions,
  };
}
