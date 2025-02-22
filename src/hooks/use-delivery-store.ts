import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DeliveryStore = {
  postcode: string;
  deliveryDescription: string;
  addressComponents: {
    district: string;
    county: string;
  };
  setPostcode: (postcode: string) => void;
  setDeliveryDescription: (deliveryDescription: string) => void;
  setAddressComponents: (components: {
    district: string;
    county: string;
  }) => void;
  clearPostcode: () => void;
};

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set) => ({
      postcode: "",
      deliveryDescription: "",
      addressComponents: {
        district: "",
        county: "",
      },
      setPostcode: (postcode: string) => set({ postcode }),
      setDeliveryDescription: (deliveryDescription: string) =>
        set({ deliveryDescription }),
      setAddressComponents: (components: {
        district: string;
        county: string;
      }) => set({ addressComponents: components }),
      clearPostcode: () =>
        set({
          postcode: "",
          deliveryDescription: "",
          addressComponents: { district: "", county: "" },
        }),
    }),
    {
      name: "delivery-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// Optional helper to get postcode without subscribing to store updates
export const getPostcode = () => useDeliveryStore.getState().postcode;
export const getDeliveryDescription = () =>
  useDeliveryStore.getState().deliveryDescription;

export const getAddressComponents = () =>
  useDeliveryStore.getState().addressComponents;
