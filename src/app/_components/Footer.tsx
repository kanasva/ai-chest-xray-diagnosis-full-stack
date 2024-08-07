export default function Footer() {
  return (
    <footer className="flex w-full justify-center bg-surface-container text-surface-on">
      <div className="my-2 flex gap-8">
        <span>
          <a href="http://kanasva.me" target="_blank">
            Kan
          </a>
        </span>
        <span>
          <a
            href="https://github.com/kanasva/ai-chest-xray-diagnosis-full-stack"
            target="_blank"
          >
            GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
