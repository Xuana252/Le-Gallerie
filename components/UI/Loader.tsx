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
