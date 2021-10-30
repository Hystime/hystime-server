import {RelationOptions} from "typeorm";

export const preventWildChild:RelationOptions = {
    orphanedRowAction: "delete"
}
