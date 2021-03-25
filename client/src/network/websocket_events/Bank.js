import { BankState } from "../../shared/state/States";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.add_bank_item = (data) => {
        BankState.addToBank(data);
    };

    eventResponses.remove_bank_item = (data) => {
        BankState.removeFromBank(data);
    };

    eventResponses.modify_bank_item = (data) => {
        BankState.modifyItem(data);
    };

    eventResponses.bank_weight = (data) => {
        BankState.setWeight(data);
    };

    eventResponses.bank_max_weight = (data) => {
        BankState.setMaxWeight(data);
    };

    eventResponses.bank_max_weight_upgrade_cost = (data) => {
        BankState.setMaxWeightUpgradeCost(data);
    };
};
