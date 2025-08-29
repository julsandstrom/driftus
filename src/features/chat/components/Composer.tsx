import { Button } from "../../../shared/components/Button";
import InputField from "../../../shared/components/InputField";
import { useChat } from "../hooks/useChat";

import MainIcon from "../../../shared/components/MainIcon";

type Props = {
  value: string;
  onChange: (s: string) => void;
  onSend: (e: React.FormEvent) => void;
  onSuggest?: () => void;
  aiLoading?: boolean;
  inputError?: string;
  setIsFocused: (v: boolean) => void;
  showAiError?: boolean;
  setShowAiError: (s: boolean) => void;
};

export default function Composer({
  value,
  onChange,
  onSend,
  onSuggest,
  aiLoading,

  setIsFocused,
}: Props) {
  const { sendingStatus, aiTipRecieved, setAiTipRecieved } = useChat();

  return (
    <form
      onSubmit={onSend}
      className="fixed  inset-x-0 bottom-0 z-50 h-[72px] md:h-auto md:static md:z-auto
             border-t border-zinc-800 md:border-none bg-[#1A1A1A]/95 backdrop-blur
             [padding-bottom:calc(env(safe-area-inset-bottom,0px)+0.25rem)] "
    >
      <div className="mx-auto w-full max-w-screen-md px-2 py-2">
        <div className="flex items-center gap-2 justify-start sm:justify-center">
          <InputField
            name="chat"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Try writing something"
            classname="w-[200px]  h-9 text-base sm:w-[400px]  md:w-[300px] lg:w-[460px] md:h-[42px]  lg:h-[50px] "
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="md:h-[42px]   lg:h-[50px]"
            disabled={sendingStatus}
          >
            {sendingStatus ? "Sending" : "Send"}
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              if (aiLoading || aiTipRecieved) return;
              onSuggest?.();
              setAiTipRecieved(true);
            }}
            className="md:h-[42px]   lg:h-[50px] border border-[#BE9C3D] px-3 py-2"
            disabled={aiLoading || aiTipRecieved}
          >
            {aiLoading ? (
              "..."
            ) : (
              <MainIcon
                className="h-5 w-5 text-[#BE9C3D]"
                title="AI suggestions"
              />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
