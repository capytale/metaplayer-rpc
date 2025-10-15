
import type { AddIdData, CollectionOf } from "@capytale/contract-builder";

import type { SimpleContentV1 } from "./simple-content";
type SimpleContentContracts = [
    AddIdData<SimpleContentV1<string>, { name: "simple-content", variant: "text" }>,
    AddIdData<SimpleContentV1<any>, { name: "simple-content", variant: "json" }>,
    AddIdData<SimpleContentV1<any>, { name: "simple-binary-data", variant: "text" }>,
];

import type { SeparateContentsV1 } from "./separate-contents";
type SeparateContentsContracts = [
    AddIdData<SeparateContentsV1<any, any>, { name: "separate-contents", variant: "json" }>,
];

import type { SeparateDualContentsV1 } from "./separate-dual-contents";
type SeparateDualContentsContracts = [
    AddIdData<SeparateDualContentsV1<any, any, any, any>, { name: "separate-dual-contents", variant: "json" }>,
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

import type { MetaPlayerUIV1 } from "./meta-player-ui";
import type { MetaPlayerEventsV1 } from "./meta-player-events";
type MetaPlayerContracts = [
    AddIdData<MetaPlayerUIV1, { name: "meta-player-ui" }>,
    AddIdData<MetaPlayerEventsV1, { name: "meta-player-events" }>,
];

export type CapytaleContracts =
    CollectionOf<SimpleContentContracts> &
    CollectionOf<SeparateContentsContracts> &
    CollectionOf<SeparateDualContentsContracts> &
    CollectionOf<ThemeContracts> &
    CollectionOf<ReloadContracts> &
    CollectionOf<SimpleContentEvalContracts> &
    CollectionOf<ModeContracts> &
    CollectionOf<WorkflowContracts> &
    CollectionOf<MetaPlayerContracts>;
