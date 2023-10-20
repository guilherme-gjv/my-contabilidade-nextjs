import { useCallback, useEffect, useState } from "react";
import { mask, unMask } from "remask";

interface CpfCnpjInputProps {
  value: string;
  onChange: (value: string) => void;
  disable?: {
    cpf?: boolean;
    cnpj?: boolean;
  };
}

const CpfCnpjInput: React.FC<CpfCnpjInputProps> = ({
  value,
  onChange,
  disable,
}) => {
  //* callbacks
  const maskCpfCnpj = useCallback(
    (value: string) => {
      const maskArray: string[] = [];
      if (!disable || (disable && !disable.cpf)) {
        maskArray.push("999.999.999-99");
      }
      if (!disable || (disable && !disable.cnpj)) {
        maskArray.push("99.999.999/9999-99");
      }
      const maskedValue = mask(unMask(value), maskArray);
      return maskedValue;
    },
    [disable]
  );

  //* states
  const [inputText, setInputText] = useState(maskCpfCnpj(value));

  //* handlers
  const handleOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCpfCnpj(evt.target.value);
    setInputText(maskedValue);
  };

  //* lifecycles
  useEffect(() => {
    const unmaskedValue = unMask(inputText);

    onChange(unmaskedValue);
  }, [inputText, onChange]);

  //* render
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
