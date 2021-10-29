import {Target} from "../entities/target";
import {TimePiece} from "../entities/timePiece";

export const targetResolver = {
    Target: {
        id: async (root: Target, args: any, context: any, info: any) => {
            return root.id;
        },
        created_at: async (root: Target, args: any, context: any, info: any) => {
            return root.created_at;
        },
        name: async (root: Target, args: any, context: any, info: any) => {
            return root.name
        },
        timeSpent: async (root: Target, args: any, context: any, info: any) => {
            return root.timeSpent;
        },
        timePieces: async (root: Target, args: any, context: any, info: any) => {
            return [];
        },
    },
    timePiece: {
        start: async (root: TimePiece, args: any, context: any, info: any) => {
            return root.start;
        },
        duration: async (root: TimePiece, args: any, context: any, info: any) => {
            return root.duration;
        },
    }
}
