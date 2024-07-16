import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  return (
    <NextTopLoader
      color="#477BE5"
      initialPosition={0.08}
      crawlSpeed={300}
      height={3}
      crawl
      showAtBottom={false}
      showSpinner={true}
      easing="ease"
      speed={300}
      zIndex={999999999}
      shadow={`0 0 10px #477BE5},0 0 5px #477BE5}`}
    />
  );
}
