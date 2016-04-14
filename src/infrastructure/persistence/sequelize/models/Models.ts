import {Model} from "sequelize";
export interface Models {
    User?: Model<any, any>;
    Song?: Model<any, any>;
    Album?: Model<any, any>;
    Artist?: Model<any, any>;
}
