import BathroomIcon from "@/components/icons/bathrooms";
import BoilerIcon from "@/components/icons/boilers";
import Electricals from "@/components/icons/electrical";
import HeatingIcon from "@/components/icons/heating";
import KitchenAndTiles from "@/components/icons/kitchen-and-tiles";
import PlumbingIcon from "@/components/icons/plumbing";
import RadiatorIcon from "@/components/icons/radiator";
import Renewables from "@/components/icons/renewables";
import Spares from "@/components/icons/spares";
import Tools from "@/components/icons/tools";

export default function CategoriesIcons() {
  return (
    <div className="flex justify-around my-5 w-[85%] mx-auto">
      <BoilerIcon />
      <RadiatorIcon />
      <HeatingIcon />
      <PlumbingIcon />
      <BathroomIcon />
      <KitchenAndTiles />
      <Spares />
      <Renewables />
      <Tools />
      <Electricals />
    </div>
  );
}
