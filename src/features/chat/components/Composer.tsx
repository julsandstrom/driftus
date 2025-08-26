import { Button } from "../../../shared/components/Button";
import InputField from "../../../shared/components/InputField";
import { useChat } from "../hooks/useChat";

type Props = {
  value: string;
  onChange: (s: string) => void;
  onSend: (e: React.FormEvent) => void;
  onSuggest?: () => void;
  aiLoading?: boolean;
  inputError?: string;
  setIsFocused: (v: boolean) => void;
};

export default function Composer({
  value,
  onChange,
  onSend,
  onSuggest,
  aiLoading,
  inputError,
  setIsFocused,
}: Props) {
  const { sendingStatus, aiTipRecieved, setAiTipRecieved } = useChat();
  return (
    <form
      onSubmit={onSend}
      className="flex flex-wrap justify-center items-end gap-3 mt-0"
    >
      <InputField
        name="chat"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Try writing something"
        classname="w-[310px] h-[50px] "
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="h-[50px]"
        disabled={sendingStatus}
      >
        {sendingStatus ? "Sending" : "Send"}
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={() => {
          if (aiLoading || aiTipRecieved) return;
          onSuggest?.();
          setAiTipRecieved(true);
        }}
        className=" h-[50px]"
        disabled={aiLoading || aiTipRecieved}
      >
        {" "}
        {aiLoading ? "Analyzing message..." : "AI Suggestions"}
      </Button>
      <p id="chat error" role="alert" className="basis-full text-red-600 mr-48">
        {inputError}
      </p>
    </form>
  );
}
