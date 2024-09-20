import NextTopLoader from "nextjs-toploader";

export default function StoreTopLoader() {
  return (
    <NextTopLoader
      color="#E00000" // HSL(0, 100%, 44%) converted to hex
      initialPosition={0.08}
      crawlSpeed={300}
      height={3}
      crawl
      showAtBottom={false}
      showSpinner={true}
      easing="ease"
      speed={300}
      zIndex={999999999}
      shadow="0 0 10px #E00000, 0 0 5px #E00000"
    />
  );
}
