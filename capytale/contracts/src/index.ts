
import type { AddIdData, CollectionOf } from "@capytale/contract-builder";

import type { SimpleContentV1 } from "./simple-content";
type SimpleContentContracts = [
    AddIdData<SimpleContentV1<string>, { name: "simple-content", variant: "text" }>,
    AddIdData<SimpleContentV1<any>, { name: "simple-content", variant: "json" }>,
    AddIdData<SimpleContentV1<any>, { name: "simple-binary-data", variant: "text" }>,
];

import type { ThemeV1 } from "./theme";
type ThemeContracts = [
    AddIdData<ThemeV1, { name: "theme" }>,
];

import type { ReloadV1 } from "./reload";
type ReloadContracts = [
    AddIdData<ReloadV1, { name: "reload" }>,
];

import type { SimpleContentEvalV1, SimpleContentEvalV2 } from "./simple-content-eval";
type SimpleContentEvalContracts = [
    AddIdData<SimpleContentEvalV1<string>, { name: "simple-content-eval", variant: "text" }>,
    AddIdData<SimpleContentEvalV1<any>, { name: "simple-content-eval", variant: "json" }>,
    AddIdData<SimpleContentEvalV2<string>, { name: "simple-content-eval", variant: "text" }>,
    AddIdData<SimpleContentEvalV2<any>, { name: "simple-content-eval", variant: "json" }>,
];

import type { ModeV1 } from "./mode";
type ModeContracts = [
    AddIdData<ModeV1, { name: "mode" }>,
];

import type { WorkflowV1 } from "./workflow";
type WorkflowContracts = [
    AddIdData<WorkflowV1, { name: "workflow" }>,
];

export type CapytaleContracts =
    CollectionOf<SimpleContentContracts> &
    CollectionOf<ThemeContracts> &
    CollectionOf<ReloadContracts> &
    CollectionOf<SimpleContentEvalContracts> &
    CollectionOf<ModeContracts> &
    CollectionOf<WorkflowContracts>;
