import { useEffect, useState } from "react";
import { mask, unMask } from "remask";

interface CpfCnpjInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CpfCnpjInput: React.FC<CpfCnpjInputProps> = ({ value, onChange }) => {
  const [inputText, setInputText] = useState("");

  const handleOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = mask(unMask(evt.target.value), [
      "999.999.999-99",
      "99.999.999/9999-99",
    ]);
    setInputText(maskedValue);
  };

  useEffect(() => {
    const unmaskedValue = unMask(inputText);

    onChange(unmaskedValue);
  }, [inputText, onChange]);

  return (
    <input
      value={inputText}
      onChange={handleOnChange}
      type="text"
      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  );
};

export default CpfCnpjInput;
