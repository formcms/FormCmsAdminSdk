import {SystemTask} from "./systemTask";

export type SystemTaskLabels = {
    [K in keyof SystemTask]: string;
}