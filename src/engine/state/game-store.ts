import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  RunState,
  CargoItem,
  GameConfig,
  DEFAULT_GAME_CONFIG,
} from "@/engine/types/game";
import { getCityById } from "@/data/cities";
import { getGoodById, calculatePrice } from "@/data/goods";
import { getShipById, calculateCargoWeight } from "@/data/ships";
import { GOODS } from "@/data/goods";
import { calculateTravelTime } from "@/engine/systems/travel";

interface GameStore {
  run: RunState | null;
  config: GameConfig;

  // Run management
  startRun: (config?: Partial<GameConfig>) => void;
  endRun: (victory: boolean) => void;
  resetRun: () => void;

  // Trading
  buyGoods: (goodId: string, quantity: number) => boolean;
  sellGoods: (goodId: string, quantity: number) => boolean;
  getGoodPrice: (goodId: string) => { buy: number; sell: number } | null;

  // Travel
  travel: (toCityId: string) => boolean;
  canTravel: (toCityId: string) => boolean;

  // Utilities
  getCargoWeight: () => number;
  getMaxCargoWeight: () => number;
  checkVictoryCondition: () => boolean;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      run: null,
      config: DEFAULT_GAME_CONFIG,

      startRun: (customConfig) => {
        const config = { ...DEFAULT_GAME_CONFIG, ...customConfig };
        const newRun: RunState = {
          id: crypto.randomUUID(),
          startedAt: Date.now(),
          gameTime: 0,
          maxGameTime: config.maxDays,
          targetGold: config.targetGold,
          player: {
            gold: config.startingGold,
            cargo: [],
            shipId: config.startingShip,
            currentCityId: config.startingCity,
          },
          isComplete: false,
          isVictory: false,
        };
        set({ run: newRun, config });
      },

      endRun: (victory) => {
        set((state) => {
          if (!state.run) return state;
          return {
            run: {
              ...state.run,
              isComplete: true,
              isVictory: victory,
            },
          };
        });
      },

      resetRun: () => {
        set({ run: null });
      },

      buyGoods: (goodId, quantity) => {
        const state = get();
        if (!state.run) return false;

        const prices = state.getGoodPrice(goodId);
        if (!prices) return false;

        const totalCost = prices.buy * quantity;
        if (state.run.player.gold < totalCost) return false;

        // Check cargo capacity
        const good = getGoodById(goodId);
        if (!good) return false;

        const currentWeight = state.getCargoWeight();
        const maxWeight = state.getMaxCargoWeight();
        const additionalWeight = good.weight * quantity;

        if (currentWeight + additionalWeight > maxWeight) return false;

        set((s) => {
          if (!s.run) return s;

          const existingCargoIndex = s.run.player.cargo.findIndex(
            (c) => c.goodId === goodId
          );

          let newCargo: CargoItem[];
          if (existingCargoIndex >= 0) {
            newCargo = s.run.player.cargo.map((c, i) =>
              i === existingCargoIndex
                ? {
                    ...c,
                    quantity: c.quantity + quantity,
                    purchasePrice:
                      (c.purchasePrice * c.quantity + prices.buy * quantity) /
                      (c.quantity + quantity),
                  }
                : c
            );
          } else {
            newCargo = [
              ...s.run.player.cargo,
              { goodId, quantity, purchasePrice: prices.buy },
            ];
          }

          return {
            run: {
              ...s.run,
              player: {
                ...s.run.player,
                gold: s.run.player.gold - totalCost,
                cargo: newCargo,
              },
            },
          };
        });

        return true;
      },

      sellGoods: (goodId, quantity) => {
        const state = get();
        if (!state.run) return false;

        const cargoItem = state.run.player.cargo.find(
          (c) => c.goodId === goodId
        );
        if (!cargoItem || cargoItem.quantity < quantity) return false;

        const prices = state.getGoodPrice(goodId);
        if (!prices) return false;

        const totalRevenue = prices.sell * quantity;

        set((s) => {
          if (!s.run) return s;

          const newCargo = s.run.player.cargo
            .map((c) =>
              c.goodId === goodId
                ? { ...c, quantity: c.quantity - quantity }
                : c
            )
            .filter((c) => c.quantity > 0);

          const newGold = s.run.player.gold + totalRevenue;
          const newRun = {
            ...s.run,
            player: {
              ...s.run.player,
              gold: newGold,
              cargo: newCargo,
            },
          };

          // Check victory
          if (newGold >= s.run.targetGold) {
            newRun.isComplete = true;
            newRun.isVictory = true;
          }

          return { run: newRun };
        });

        return true;
      },

      getGoodPrice: (goodId) => {
        const state = get();
        if (!state.run) return null;

        const city = getCityById(state.run.player.currentCityId);
        if (!city) return null;

        const good = getGoodById(goodId);
        if (!good) return null;

        const cityGood = city.goods.find((g) => g.goodId === goodId);
        if (!cityGood) return null;

        const basePrice = calculatePrice(good.basePrice, cityGood.priceModifier, 0);
        return {
          buy: Math.round(basePrice * 1.1), // 10% markup for buying
          sell: Math.round(basePrice * 0.9), // 10% markdown for selling
        };
      },

      travel: (toCityId) => {
        const state = get();
        if (!state.canTravel(toCityId)) return false;

        const fromCity = getCityById(state.run!.player.currentCityId);
        const toCity = getCityById(toCityId);
        const ship = getShipById(state.run!.player.shipId);

        if (!fromCity || !toCity || !ship) return false;

        const travelTime = calculateTravelTime(fromCity, toCity, ship.speed);

        set((s) => {
          if (!s.run) return s;

          const newGameTime = s.run.gameTime + travelTime;
          const newRun = {
            ...s.run,
            gameTime: newGameTime,
            player: {
              ...s.run.player,
              currentCityId: toCityId,
            },
          };

          // Check time limit
          if (newGameTime >= s.run.maxGameTime) {
            newRun.isComplete = true;
            newRun.isVictory = s.run.player.gold >= s.run.targetGold;
          }

          return { run: newRun };
        });

        return true;
      },

      canTravel: (toCityId) => {
        const state = get();
        if (!state.run || state.run.isComplete) return false;

        const currentCity = getCityById(state.run.player.currentCityId);
        if (!currentCity) return false;

        return currentCity.connections.includes(toCityId);
      },

      getCargoWeight: () => {
        const state = get();
        if (!state.run) return 0;
        return calculateCargoWeight(state.run.player.cargo, GOODS);
      },

      getMaxCargoWeight: () => {
        const state = get();
        if (!state.run) return 0;
        const ship = getShipById(state.run.player.shipId);
        return ship?.capacity ?? 0;
      },

      checkVictoryCondition: () => {
        const state = get();
        if (!state.run) return false;
        return state.run.player.gold >= state.run.targetGold;
      },
    }),
    {
      name: "hanse-nova-game",
    }
  )
);
