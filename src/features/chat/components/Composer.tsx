import { Button } from "../../../shared/components/Button";
import InputField from "../../../shared/components/InputField";
import { useChat } from "../hooks/useChat";
import { StatusBar } from "./StatusBar";
import MainIcon from "../../../shared/components/MainIcon";

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
  const {
    sendingStatus,
    aiTipRecieved,
    setAiTipRecieved,
    flashText,
    flashKind,
  } = useChat();
  return (
    <form
      onSubmit={onSend}
      className="flex flex-wrap justify-center items-end gap-3 mt-0"
    >
      <div className="basis-full h-11">
        <StatusBar text={flashText} kind={flashKind} />
      </div>
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

      {inputError && (
        <div className="basis-full flex justify-center items-end">
          {" "}
          <span>
            {" "}
            <MainIcon className={`h-9 w-9 pb-1 text-red-600`} />{" "}
          </span>
          <p id="chat error" role="alert" className="  mr-48">
            {inputError}
          </p>
        </div>
      )}
    </form>
  );
}
