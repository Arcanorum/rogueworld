import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import weightIcon from "../../../../../assets/images/gui/hud/weight-icon.png";
import infoIcon from "../../../../../assets/images/gui/panels/crafting/info-icon.png";
import craftButtonBorderValid from "../../../../../assets/images/gui/panels/crafting/craft-button-border-valid.png";
import craftButtonBorderInvalid from "../../../../../assets/images/gui/panels/crafting/craft-button-border-invalid.png";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import CraftingRecipes from "../../../../../catalogues/CraftingRecipes.json";
import Utils from "../../../../../shared/Utils";
import "./CraftingPanel.scss";
import { GUIState, InventoryState } from "../../../../../shared/state/States";
import ItemTooltip from "../../item_tooltip/ItemTooltip";

const findAmountInInventory = (ingredient) => {
    const found = InventoryState.items.find(
        (item) => item.typeCode === ingredient.itemTypeCode,
    );

    if (found) {
        return found.quantity;
    }

    return 0;
};

function IngredientRow({ ingredient }) {
    const [amountInInventory] = useState(findAmountInInventory(ingredient));

    return (
        <div className="row">
            <img
              src={ItemIconsList[
                  ItemTypes[ingredient.itemTypeCode].iconSource
              ]}
              className="icon"
              onMouseEnter={() => {
                  GUIState.setTooltipContent(
                      <ItemTooltip
                        itemTypeCode={ingredient.itemTypeCode}
                      />,
                  );
              }}
              onMouseLeave={() => {
                  GUIState.setTooltipContent(null);
              }}
            />
            <span className="text high-contrast-text">{ingredient.quantity || ingredient.durability}</span>
            <span className="space" />
            <span className={`text high-contrast-text ${amountInInventory < ingredient.quantity ? "invalid" : ""}`}>
                {`(${amountInInventory})`}
            </span>
        </div>
    );
}

IngredientRow.propTypes = {
    ingredient: PropTypes.object.isRequired,
};

function RecipeSlot({ recipe, canBeCrafted, onClick }) {
    return (
        <div className="item-slot">
            <div
              className={`details ${canBeCrafted ? "craftable" : ""}`}
              draggable={false}
              onMouseEnter={() => {
                  GUIState.setTooltipContent(
                      <ItemTooltip itemTypeCode={recipe.result.itemTypeCode} />,
                  );
              }}
              onMouseLeave={() => {
                  GUIState.setTooltipContent(null);
              }}
              onClick={() => { onClick(recipe); }}
            >
                <img
                  src={ItemIconsList[ItemTypes[recipe.result.itemTypeCode].iconSource]}
                  draggable={false}
                />
                <div
                  className={`high-contrast-text ${(recipe.result.baseQuantity > 999 || recipe.result.baseDurability > 999) ? "small" : ""}`}
                >
                    {Utils.formatItemValue(recipe.result.baseQuantity) || Utils.formatItemValue(recipe.result.baseDurability) || "???"}
                </div>
            </div>
        </div>
    );
}

RecipeSlot.propTypes = {
    recipe: PropTypes.object.isRequired,
    canBeCrafted: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

function CraftingPanel({ onCloseCallback }) {
    const [recipes, setRecipes] = useState(CraftingRecipes.filter((recipe) => {
        // Get all of the recipes that are valid at this crafting station type.
        if (recipe.stationTypeNumbers.some(
            (stationTypeNumber) => stationTypeNumber === GUIState.craftingStation.typeNumber,
        )) {
            return recipe.result;
        }
        return false;
    }));
    const [searchRecipes, setSearchRecipes] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [inventoryWeight, setInventoryWeight] = useState(InventoryState.weight);
    const [inventoryMaxWeight, setInventoryMaxWeight] = useState(InventoryState.maxWeight);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [playerHasIngredients, setPlayerHasIngredients] = useState(false);

    const onRecipePressed = (recipe) => {
        setSelectedRecipe(recipe);
    };

    useEffect(() => {
        if (selectedRecipe) {
            // Check if the player has all of the required ingredients.
            const hasEveryIngredient = selectedRecipe.ingredients.every((ingredient) => (
                InventoryState.items.find(() => findAmountInInventory(ingredient))));

            setPlayerHasIngredients(hasEveryIngredient);
        }
        else {
            setPlayerHasIngredients(false);
        }
    }, [selectedRecipe]);

    useEffect(() => {
        const filteredRecipes = recipes.filter((recipe) => Utils
            .getTextDef(`Item name: ${ItemTypes[recipe.result.itemTypeCode].translationID}`)
            .toLowerCase()
            .includes(searchText));

        setSearchRecipes(filteredRecipes);

        setSelectedRecipe(null);

        // Also hide the tooltip, as onMouseLeave doesn't get fired when an element is removed, so
        // if the cursor is over one of the slots and showing the tooltip when someone searches, if
        // the slot gets filtered out the tooltip for it will remain visible.
        GUIState.setTooltipContent(null);
    }, [searchText, recipes]);

    return (
        <div className="crafting-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width="70vw"
              height="60vh"
              panelName={GUIState.craftingStation.name}
              icon={GUIState.craftingStation.icon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="list-cont">
                        <div className="top-bar">
                            <div
                              className="weight"
                              onMouseEnter={() => {
                                  GUIState.setTooltipContent(Utils.getTextDef("Total inventory weight"));
                              }}
                              onMouseLeave={() => {
                                  GUIState.setTooltipContent(null);
                              }}
                            >
                                <img
                                  src={weightIcon}
                                  width="32px"
                                  height="32px"
                                />
                                <span className="high-contrast-text">
                                    {`${inventoryWeight}/${inventoryMaxWeight}`}
                                </span>
                            </div>
                            <div className="search">
                                <input
                                  placeholder={Utils.getTextDef("Item search")}
                                  onChange={(event) => {
                                      setSearchText(event.target.value.toLowerCase());
                                  }}
                                  autoFocus
                                />
                            </div>
                        </div>
                        <div className="list">
                            {searchText && searchRecipes.map((recipe) => (
                                <RecipeSlot
                                  key={recipe.id}
                                  recipe={recipe}
                                  canBeCrafted
                                  onClick={onRecipePressed}
                                />
                            ))}
                            {searchText && !searchRecipes.length && <div className="warning">No items found.</div>}
                            {!searchText && recipes.map((recipe) => (
                                <RecipeSlot
                                  key={recipe.id}
                                  recipe={recipe}
                                  canBeCrafted
                                  onClick={onRecipePressed}
                                />
                            ))}
                            {!searchText && !recipes.length && <div className="warning">No crafting options available.</div>}
                        </div>
                    </div>
                    <div className={`selection-cont ${selectedRecipe ? "" : "unselected"}`}>
                        <div className="name high-contrast-text">
                            {
                                selectedRecipe
                                    ? Utils.getTextDef(`Item name: ${ItemTypes[selectedRecipe.result.itemTypeCode].translationID}`)
                                    : ""
                            }
                        </div>
                        <div className="icon-cont">
                            {selectedRecipe && (
                                <>
                                    <img src={ItemIconsList[ItemTypes[selectedRecipe.result.itemTypeCode].iconSource]} className="icon" />
                                    <div className="amount high-contrast-text">
                                        {selectedRecipe.result.baseQuantity
                                        || selectedRecipe.result.baseDurability}
                                    </div>
                                    <img
                                      src={infoIcon}
                                      className="info"
                                      onMouseEnter={() => {
                                          GUIState.setTooltipContent("Show item details");
                                      }}
                                      onMouseLeave={() => {
                                          GUIState.setTooltipContent(null);
                                      }}
                                    />
                                </>
                            )}
                        </div>
                        <div className="ingredients-list">
                            {selectedRecipe && selectedRecipe.ingredients.map((ingredient) => (
                                <IngredientRow
                                  key={Math.random()} // Shut React up, as this array doesn't change.
                                  ingredient={ingredient}
                                />
                            ))}
                        </div>
                        <div className={`button-cont ${(selectedRecipe && playerHasIngredients) ? "valid" : ""}`}>
                            <img src={
                                (selectedRecipe && playerHasIngredients)
                                    ? craftButtonBorderValid
                                    : craftButtonBorderInvalid
                                }
                            />
                            <div>{(selectedRecipe && playerHasIngredients) ? Utils.getTextDef("Craft") : ""}</div>
                        </div>
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

CraftingPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default CraftingPanel;
