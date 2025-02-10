import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DeliveryStore = {
  postcode: string;
  deliveryDescription: string;
  setPostcode: (postcode: string) => void;
  setDeliveryDescription: (deliveryDescription: string) => void;
  clearPostcode: () => void;
};

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set) => ({
      postcode: "",
      deliveryDescription: "",
      setPostcode: (postcode: string) => set({ postcode }),
      setDeliveryDescription: (deliveryDescription: string) =>
        set({ deliveryDescription }),
      clearPostcode: () => set({ postcode: "" }),
    }),
    {
      name: "delivery-storage",
      // Storage defaults to localStorage - you can change to sessionStorage if preferred
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// Optional helper to get postcode without subscribing to store updates
export const getPostcode = () => useDeliveryStore.getState().postcode;
export const getDeliveryDescription = () =>
  useDeliveryStore.getState().deliveryDescription;
