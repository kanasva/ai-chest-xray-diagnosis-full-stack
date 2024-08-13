import Image from "next/image";
import GitHubLogo from "./GitHubLogo";

export default function Footer() {
  return (
    <div className="flex w-full justify-center bg-surface-container px-4 text-surface-on sm:px-6">
      <footer className="flex w-full max-w-[1280px] justify-end">
        <div className="my-2 flex gap-6">
          <a href="http://kanasva.me" target="_blank">
            Kan
          </a>
          <a
            href="https://github.com/kanasva/ai-chest-xray-diagnosis-full-stack"
            target="_blank"
          >
            <GitHubLogo
              className="h-6 w-6 fill-surface-on"
              title="GitHub respository"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}
