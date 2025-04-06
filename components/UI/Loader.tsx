

export default function Loader() {
  return (
    <div className="w-full flex justify-center mt-4">
      <div className="loader"></div>
    </div>
  );
}
export function Spinner() {
  return (
    <div className="size-full flex justify-center items-center px-2">
      <div className="spinner"></div>
    </div>
  );
}
export function AppLogoLoader() {
  return (
    <div className="size-full flex justify-center items-center">
      <div className="logoLoader absolute font-AppLogo text-5xl">AppLogo</div>
    </div>
  );
}

export function NumberLoader() {
  return (
    <span className="max-h-[1em] w-fit overflow-auto no-scrollbar flex flex-row gap-1">
      <span
        className="number-scroll-up  w-fit "
        style={{ animationDelay: `-2s` }}
      >
        <span>3</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>3</span>
      </span>
      <span className="number-scroll-down  w-fit"
       style={{ animationDelay: `-0s` }}>
        <span>9</span>
        <span>3</span>
        <span>3</span>
        <span>5</span>
        <span>9</span>
      </span>

      <span className="number-scroll-up w-fit"
       style={{ animationDelay: `-1s` }}>
        <span>7</span>
        <span>4</span>
        <span>2</span>
        <span>9</span>
        <span>7</span>
      </span>
    </span>
  );
}
