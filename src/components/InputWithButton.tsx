import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MouseEvent, FormEvent } from "react";

interface InputWithButtonProps {
  buttonName: string;
  placeholder: string;
  prompt: string;
  onClick: (event: MouseEvent) => void;
  onKeyDown: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputWithButton({
  buttonName,
  placeholder,
  prompt,
  onClick,
  onKeyDown,
  onChange,
}: InputWithButtonProps) {
  return (
    <form
      onSubmit={onKeyDown}
      className="flex mt-4 w-full max-w-lg items-center space-x-2"
    >
      <Input
        type="email"
        placeholder={placeholder}
        value={prompt}
        onChange={(event) => onChange(event)}
      />
      <Button type="submit" onClick={(event) => onClick(event)}>
        {buttonName}
      </Button>
    </form>
  );
}

export default InputWithButton;
